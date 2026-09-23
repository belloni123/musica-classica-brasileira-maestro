import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(path) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  new Function('exports', 'require', code)(exports, require);
  return exports;
}

const { parseInstrumentFormData } = load('../lib/validators/instrument.ts');
const { parseComposerFormData } = load('../lib/validators/composer.ts');
const { parseWorkInstrumentationBatchFormData } = load('../lib/validators/work-instrumentation.ts');

test('instrument form accepts a selected family and saves its resolved name', () => {
  const form = new FormData();
  form.set('name', 'Flauta doce');
  form.set('family_id', '123e4567-e89b-12d3-a456-426614174000');
  form.set('active', 'on');
  const result = parseInstrumentFormData(form, 'Madeiras');
  assert.equal(result.family, 'Madeiras');
  assert.equal(result.family_id, '123e4567-e89b-12d3-a456-426614174000');
  assert.equal(result.active, true);
  assert.throws(() => parseInstrumentFormData(form, ''));
});

test('composer dates accept manual Brazilian dates and year-only records', () => {
  const form = new FormData();
  form.set('canonical_name', 'Compositor de teste');
  form.set('display_name', 'Teste, Compositor');
  form.set('birth_date', '07/09/1822');
  form.set('birth_year', '1822');
  form.set('death_year', '1890');
  assert.deepEqual(
    (({ birth_date, birth_year, death_date, death_year }) => ({ birth_date, birth_year, death_date, death_year }))(parseComposerFormData(form)),
    { birth_date: '1822-09-07', birth_year: 1822, death_date: null, death_year: 1890 },
  );
  form.set('birth_date', '31/02/1822');
  assert.throws(() => parseComposerFormData(form));
  form.set('birth_date', '29/02/1800');
  assert.throws(() => parseComposerFormData(form));
  form.set('birth_date', '29/02/1804');
  assert.equal(parseComposerFormData(form).birth_date, '1804-02-29');
});

test('instrumentation batch parses multiple rows and exact quantities together', () => {
  const form = new FormData();
  form.set('item_count', '2');
  form.set('instrument_id_0', '123e4567-e89b-12d3-a456-426614174000');
  form.set('exact_quantity_0', '2');
  form.set('required_0', 'on');
  form.set('instrument_id_1', '123e4567-e89b-12d3-a456-426614174001');
  form.set('exact_quantity_1', '4');
  form.set('optional_1', 'on');
  const rows = parseWorkInstrumentationBatchFormData(form);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows.map(({ minimum_quantity, maximum_quantity }) => [minimum_quantity, maximum_quantity]), [[2, 2], [4, 4]]);
  assert.equal(rows[0].required, true);
  assert.equal(rows[1].optional, true);
});

test('instrumentation batch rejects invalid rows before any insert', () => {
  const form = new FormData();
  form.set('item_count', '2');
  form.set('instrument_id_0', '123e4567-e89b-12d3-a456-426614174000');
  form.set('exact_quantity_0', '2');
  form.set('instrument_id_1', '123e4567-e89b-12d3-a456-426614174001');
  form.set('minimum_quantity_1', '5');
  form.set('maximum_quantity_1', '2');
  assert.throws(() => parseWorkInstrumentationBatchFormData(form));
  form.set('maximum_quantity_1', '6');
  form.set('exact_quantity_1', '4');
  assert.throws(() => parseWorkInstrumentationBatchFormData(form));
  form.set('item_count', '41');
  assert.throws(() => parseWorkInstrumentationBatchFormData(form));
});
