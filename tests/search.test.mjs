import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function load(path) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  new Function('exports', code)(exports);
  return exports;
}
const { cleanNumber, searchPattern, validateSearchRanges, pageNumber } = load('../lib/search/input.ts');
const { savedSearchUrl } = load('../lib/search/saved.ts');
const { safeExternalUrl } = load('../lib/catalog/types.ts');

test('empty numeric fields are not zero filters', () => {
  for (const value of [undefined, '', '   ']) assert.equal(cleanNumber(value), null);
  assert.equal(cleanNumber('0'), 0);
  assert.equal(cleanNumber('1900'), 1900);
  for (const value of ['abc', 'Infinity', '-1']) assert.throws(() => cleanNumber(value));
});
test('reject inverted ranges and contradictory choir filters', () => {
  validateSearchRanges({duracao_de:'',duracao_ate:''});
  assert.throws(() => validateSearchRanges({duracao_de:'20',duracao_ate:'10'}));
  assert.throws(() => validateSearchRanges({coro:'on',sem_coro:'on'}));
});
test('normalize accents/hyphens and remove filter syntax', () => {
  assert.equal(searchPattern('João Villa-Lobos'), '%joao%villa%lobos%');
  assert.equal(searchPattern('Op. 12'), '%op%12%');
  assert.equal(searchPattern('%(_,x)'), '%x%');
  assert.equal(pageNumber('-3'), 1);
  assert.equal(pageNumber('2'), 2);
});
test('saved searches cannot redirect offsite or inject arbitrary fields', () => {
  const href = savedSearchUrl({path:'https://evil.invalid',titulo:'Canção',next:'//evil.invalid'});
  assert.ok(href.startsWith('/buscar?'));
  assert.ok(!href.includes('evil'));
});
test('external catalog links permit only HTTP(S)', () => {
  assert.equal(safeExternalUrl('javascript:alert(1)'), null);
  assert.equal(safeExternalUrl('data:text/html,test'), null);
  assert.equal(safeExternalUrl('https://example.com'), 'https://example.com/');
});
