import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(path, dependencies = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  new Function('exports', 'require', code)(exports, name => dependencies[name] ?? require(name));
  return exports;
}
const http = load('../lib/integrations/http.ts');
const schemas = load('../lib/integrations/schemas.ts', {
  '@/lib/catalog/options': load('../lib/catalog/options.ts'),
  '@/lib/validators/composer': load('../lib/validators/composer.ts'),
});

// Replace only Supabase I/O; exercise the real authorization, routes, and MCP transport.
function fixture() {
  const state = {
    profile: { role: 'user', status: 'active' }, authError: null, profileError: null,
    reads: 0, writes: 0, profileChecks: 0, queries: [],
  };
  const catalog = load('../lib/integrations/catalog.ts', {
    './http': http, './schemas': schemas,
    '@/lib/env': { publicEnv: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.test', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-key' } },
    '@supabase/supabase-js': { createClient: () => ({
      auth: { getUser: async token => ({
        data: { user: token === 'valid-token' ? { id: 'account-id' } : null }, error: state.authError,
      }) },
      from: table => {
        if (table === 'profiles') return {
          select: () => ({ eq: (column, value) => {
            assert.equal(column, 'id');
            assert.equal(value, 'account-id');
            return { maybeSingle: async () => {
              state.profileChecks++;
              return { data: state.profile, error: state.profileError };
            } };
          } }),
        };
        state.reads++;
        const operations = { table, filters: [] };
        state.queries.push(operations);
        const query = {
          select: columns => { operations.columns = columns; return query; },
          order: () => query, range: () => query, like: () => query,
          eq: (key, value) => { operations.filters.push([key, value]); return query; },
          then: resolve => Promise.resolve({ data: [{ slug: 'obra-exemplo' }], count: 1, error: null }).then(resolve),
        };
        return query;
      },
      rpc: async () => { state.writes++; return { data: { dry_run: true }, error: null }; },
    }) },
  });
  const dependencies = {
    '@/lib/integrations/catalog': catalog, '@/lib/integrations/http': http, '@/lib/integrations/schemas': schemas,
  };
  const rest = load('../app/api/v1/catalog/[entity]/route.ts', dependencies);
  const mcp = load('../app/api/mcp/route.ts', dependencies);
  const imports = load('../app/api/v1/imports/route.ts', dependencies);
  function request(path, token, body) {
    return new Request(`https://example.test${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        ...(token === undefined ? {} : { Authorization: `Bearer ${token}` }),
        ...(body ? { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }
  return {
    state, catalog, rest,
    query: (token, entity = 'works') => rest.GET(request(`/api/v1/catalog/${entity}`, token), { params: Promise.resolve({ entity }) }),
    mcp: (token, method = 'tools/list', params) => mcp.POST(request('/api/mcp', token, { jsonrpc: '2.0', id: 1, method, params })),
    import: token => imports.POST(request('/api/v1/imports', token, {
      entity: 'composers', mode: 'preview', file_name: 'teste.csv',
      rows: [{ slug: 'compositor-exemplo', canonical_name: 'Exemplo', display_name: 'Exemplo' }],
    })),
  };
}

function privateResponse(response) {
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal(response.headers.get('vary'), 'Authorization');
}

for (const scenario of [
  { name: 'missing token', token: undefined, status: 401 },
  { name: 'invalid or expired token', token: 'invalid-token', status: 401 },
  { name: 'malformed bearer token', token: 'bad token', status: 401 },
  ...['suspended', 'inactive', 'removed', 'invited'].map(status => ({
    name: `${status} account`, token: 'valid-token', status: 403, profile: { role: 'admin', status },
  })),
  { name: 'missing profile', token: 'valid-token', status: 403, profile: null },
  { name: 'profile lookup failure', token: 'valid-token', status: 503, profileError: { message: 'unavailable' } },
  { name: 'auth service failure', token: 'valid-token', status: 503, authError: { status: 500 } },
  { name: 'auth throttled', token: 'valid-token', status: 429, authError: { status: 429 } },
]) {
  test(`REST and MCP deny ${scenario.name} before reading catalog`, async () => {
    const f = fixture();
    for (const key of ['profile', 'profileError', 'authError']) if (key in scenario) f.state[key] = scenario[key];
    for (const entity of ['works', 'composers', 'conductors']) {
      const response = await f.query(scenario.token, entity);
      assert.equal(response.status, scenario.status);
      privateResponse(response);
    }
    for (const [method, params] of [
      ['initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'test', version: '1' } }],
      ['tools/list'], ['tools/call', { name: 'consultar_catalogo', arguments: { entity: 'works' } }],
    ]) {
      const response = await f.mcp(scenario.token, method, params);
      assert.equal(response.status, scenario.status);
      privateResponse(response);
    }
    assert.equal(f.state.reads, 0);
    assert.equal(f.state.writes, 0);
  });
}

test('active ordinary account can query all entities and MCP but cannot import', async () => {
  const f = fixture();
  for (const entity of ['works', 'composers', 'conductors']) {
    const response = await f.query('valid-token', entity);
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).data, [{ slug: 'obra-exemplo' }]);
    privateResponse(response);
  }
  const listed = await f.mcp('valid-token');
  assert.equal(listed.status, 200);
  assert.deepEqual((await listed.json()).result.tools.map(tool => tool.name), ['consultar_catalogo']);
  const result = await f.mcp('valid-token', 'tools/call', { name: 'consultar_catalogo', arguments: { entity: 'works' } });
  assert.equal(result.status, 200);
  privateResponse(result);
  assert.equal(JSON.parse((await result.json()).result.content[0].text).data[0].slug, 'obra-exemplo');
  assert.equal((await f.import('valid-token')).status, 403);
  const deniedTool = await f.mcp('valid-token', 'tools/call', {
    name: 'prever_importacao', arguments: { entity: 'composers', rows: [{ slug: 'exemplo' }] },
  });
  const denied = await deniedTool.json();
  assert.ok(denied.error || denied.result?.isError);
  assert.equal(f.state.writes, 0);
  for (const query of f.state.queries) {
    assert.ok(query.filters.some(([key, value]) => key === 'publication_status' && value === 'published'));
    assert.doesNotMatch(query.columns, /subscriber_notes|performance_notes|editorial/);
  }
});

for (const role of ['editor', 'admin']) {
  test(`active ${role} retains editorial access`, async () => {
    const f = fixture();
    f.state.profile.role = role;
    const response = await f.mcp('valid-token');
    assert.deepEqual((await response.json()).result.tools.map(tool => tool.name), [
      'consultar_catalogo', 'prever_importacao', 'aplicar_importacao',
    ]);
    assert.equal((await f.import('valid-token')).status, 200);
    assert.equal(f.state.writes, 1);
    const preview = await f.mcp('valid-token', 'tools/call', {
      name: 'prever_importacao', arguments: {
        entity: 'composers', file_name: 'teste.csv', rows: [{ slug: 'compositor-exemplo' }],
      },
    });
    assert.equal((await preview.json()).result.isError, undefined);
    assert.equal(f.state.writes, 2);
    f.state.profile.status = 'suspended';
    assert.equal((await f.import('valid-token')).status, 403);
    assert.equal(f.state.writes, 2);
  });
}

test('account deactivation blocks the next REST and MCP calls with the same token', async () => {
  const f = fixture();
  assert.equal((await f.query('valid-token')).status, 200);
  assert.equal((await f.mcp('valid-token')).status, 200);
  f.state.profile.status = 'suspended';
  assert.equal((await f.query('valid-token')).status, 403);
  assert.equal((await f.mcp('valid-token')).status, 403);
  assert.equal(f.state.profileChecks, 4);
  assert.equal(f.state.reads, 1);
});

test('REST CORS preflight permits Authorization without returning catalog data', async () => {
  const f = fixture();
  const response = f.rest.OPTIONS();
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-headers'), 'Authorization');
  assert.equal(await response.text(), '');
  assert.equal(f.state.reads, 0);
});

test('public site catalog helper remains usable independently of integration authentication', async () => {
  const f = fixture();
  assert.equal((await f.catalog.readCatalog({ entity: 'conductors' })).data.length, 1);
  assert.equal(f.state.profileChecks, 0);
});

test('OpenAPI declares account authentication and 401/403 for catalog queries', async () => {
  const route = load('../app/api/v1/openapi.json/route.ts', {
    '@/lib/integrations/http': http, '@/lib/integrations/schemas': schemas,
  });
  const spec = await route.GET().json();
  const query = spec.paths['/api/v1/catalog/{entity}'].get;
  assert.deepEqual(query.security, [{ accountToken: [] }]);
  assert.ok(query.responses['401']);
  assert.ok(query.responses['403']);
  assert.equal(spec.components.securitySchemes.accountToken.scheme, 'bearer');
});
