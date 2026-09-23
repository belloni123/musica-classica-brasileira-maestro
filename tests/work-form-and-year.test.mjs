import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const nodeRequire = createRequire(import.meta.url);
function load(path, dependencies = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  new Function('exports', 'require', code)(exports, id => dependencies[id] ?? nodeRequire(id));
  return exports;
}

const options = load('../lib/catalog/options.ts');
const composer = load('../lib/validators/composer.ts');
const { parseWorkFormData, parseChoirVoices } = load('../lib/validators/work.ts', {
  '@/lib/catalog/options': options,
  '@/lib/validators/composer': composer,
});

test('composition year uses the available endpoint', () => {
  assert.equal(options.compositionYearLabel(null, 1809), '1809');
  assert.equal(options.compositionYearLabel(1808, 1809), '1808–1809');
  assert.equal(options.compositionYearLabel(null, null), 's/d');
});

test('work form accepts curated options and selected choir voices', () => {
  const form = new FormData();
  form.set('composer_id', '123e4567-e89b-12d3-a456-426614174000');
  form.set('canonical_title', 'Obra de teste');
  form.set('display_title', 'Obra de teste');
  form.set('composition_year_start', '1809');
  form.set('duration_minutes', '12.5');
  form.set('formation_type', 'Orquestra de câmara');
  form.set('soloist_type', 'vocal');
  form.set('has_choir', 'yes');
  form.append('choir_voice', 'Soprano');
  form.append('choir_voice', 'Tenor');
  const parsed = parseWorkFormData(form);
  assert.equal(parsed.composition_year_start, 1809);
  assert.equal(parsed.has_soloist, true);
  assert.equal(parsed.has_choir, true);
  assert.deepEqual(parseChoirVoices(form), ['Soprano', 'Tenor']);
  form.set('has_choir', 'no');
  assert.deepEqual(parseChoirVoices(form), []);
  form.set('formation_type', 'Outra formação');
  assert.throws(() => parseWorkFormData(form));
});
