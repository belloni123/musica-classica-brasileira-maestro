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
const { sortComposers, composerIndexLetter, composerBirthplace } = load('../lib/catalog/composers.ts');
const { instrumentationCode, instrumentationCriteria, matchesInstrumentation, orchestralInstruments } = load('../lib/catalog/instrumentation.ts');
const composer = (display_name, surname = null) => ({ display_name, surname, canonical_name: 'Nome completo' });
const row = (name, quantity = 2, overrides = {}) => ({ instruments: { name }, minimum_quantity: quantity, maximum_quantity: quantity, quantity_text: null, ...overrides });
const orchestra = orchestralInstruments.map((instrument, index) => row(instrument.name, [2,2,2,2,4,2,3,1][index]));

test('surname heading controls ordering and letter filters, including accents and compound names', () => {
  const rows = [composer('Nepomuceno, Alberto'), composer('Levy, Alexandre'), composer('Garcia, José Maurício Nunes', 'Nunes Garcia'), composer('Álvares Lobo, Elias'), composer('Gomes, Antonio Carlos')];
  assert.deepEqual(sortComposers(rows).map(composerIndexLetter), ['A','G','G','L','N']);
  assert.deepEqual(sortComposers(rows, 'G').map(x => x.display_name), ['Garcia, José Maurício Nunes','Gomes, Antonio Carlos']);
  assert.equal(sortComposers(rows, 'A').length, 1);
  assert.equal(composerIndexLetter(composer('Heitor Villa-Lobos', 'Villa-Lobos')), 'V');
  assert.equal(sortComposers(rows, 'Z').length, 0);
});
test('birthplace displays city and UF without making up absent data', () => {
  assert.equal(composerBirthplace('Rio de Janeiro', 'Rio de Janeiro'), 'Rio de Janeiro — RJ');
  assert.equal(composerBirthplace('São Paulo', 'sp'), 'São Paulo — SP');
  assert.equal(composerBirthplace(null, 'Ceará'), 'CE');
  assert.equal(composerBirthplace('Nápoles', null), 'Nápoles');
  assert.equal(composerBirthplace(null, ''), 'Naturalidade não informada');
});
test('orchestral code follows user example, regardless of input order', () => {
  assert.equal(instrumentationCode([...orchestra, row('Tímpanos'), row('Violino'), row('Viola')].reverse()), '2 2 2 2 - 4 2 3 1 - Tmp - Str');
  assert.equal(instrumentationCode([]), null);
  assert.equal(instrumentationCode([row('Flauta'),row('Clarinete'),row('Trompa'),row('Trompete')]), '2 0 2 0 - 2 2 0 0');
});
test('summary preserves ranges, unknowns, extras and optional/doubling markers', () => {
  const code = instrumentationCode([row('Flauta', 2, {maximum_quantity:3}), row('Oboé', null), row('Clarinete',2,{doubling:true}), row('Piano',1)]);
  assert.equal(code, '2–3 ? 2* 0 - 0 0 0 0 - Piano (1)');
  assert.ok(!instrumentationCode([row('Violão')]).includes('Str'));
});
test('quantity filters combine with AND and accept numeric ranges', () => {
  assert.ok(matchesInstrumentation(orchestra, instrumentationCriteria({qtd_flautas:'2',qtd_oboes:'2',qtd_trompas:'4'})));
  assert.ok(!matchesInstrumentation(orchestra, instrumentationCriteria({qtd_flautas:'2',qtd_oboes:'3'})));
  assert.ok(matchesInstrumentation([row('Flauta',2,{maximum_quantity:3})], instrumentationCriteria({qtd_flautas:'3'})));
  assert.ok(!matchesInstrumentation(orchestra, instrumentationCriteria({timpanos:'on'})));
  assert.ok(matchesInstrumentation([...orchestra,row('Tímpanos'),row('Violoncelo')], instrumentationCriteria({timpanos:'on',cordas:'on'})));
});
test('blank is no filter; missing or unquantified instruments are not numeric matches', () => {
  assert.deepEqual(instrumentationCriteria({qtd_flautas:' '}), {quantities:{},timpani:false,strings:false});
  assert.ok(!matchesInstrumentation([], instrumentationCriteria({qtd_flautas:'0'})));
  assert.ok(!matchesInstrumentation([row('Flauta',null)], instrumentationCriteria({qtd_flautas:'2'})));
  assert.ok(matchesInstrumentation([row('Flauta',0)], instrumentationCriteria({qtd_flautas:'0'})));
  for(const value of ['-1','2.5','abc','1001']) assert.throws(() => instrumentationCriteria({qtd_flautas:value}));
});
