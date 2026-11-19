import { readFileSync, statSync } from "node:fs";
import { basename } from "node:path";
import { parse } from "csv-parse/sync";

const entities = new Set(["composers", "conductors", "works"]);
const integerFields = new Set([
  "birth_year", "death_year", "composition_year_start", "composition_year_end", "revision_year",
  "duration_minimum", "duration_maximum",
]);
const booleanFields = new Set([
  "has_choir", "has_electronics", "has_brazilian_instruments", "educational_work", "youth_work", "public_domain",
]);
const listFields = new Set(["alternative_names", "pseudonyms", "alternative_titles"]);

function instrumentationFor(value) {
  if (value === "[]") return [];
  const items = value.split("|");
  if (items.length > 40) throw new Error("Use até 40 instrumentos por obra.");
  return items.map((item) => {
    const match = /^([^=]+?)\s*=\s*(\d{1,4})(?:\s*([-–])\s*(\d{1,4})|(\+))?$/.exec(item.trim());
    if (!match) throw new Error(`Instrumentação inválida em "${item.trim()}". Use Instrumento=3, Instrumento=2-3 ou Instrumento=3+.`);
    const instrument = match[1].trim();
    const minimum_quantity = Number(match[2]);
    const maximum_quantity = match[5] ? null : Number(match[4] ?? match[2]);
    if (!instrument || minimum_quantity > 1000 ||
        (maximum_quantity !== null && (maximum_quantity > 1000 || maximum_quantity < minimum_quantity))) {
      throw new Error(`Instrumento ou quantidade inválida em "${item.trim()}".`);
    }
    return { instrument, minimum_quantity, maximum_quantity };
  });
}

function valueFor(field, value) {
  if (field === "instrumentation") return instrumentationFor(value);
  if (value === "<NULL>") return null;
  if (integerFields.has(field) || field === "duration_minutes") {
    const decimal = field === "duration_minutes";
    if (!(decimal ? /^\d+(?:[.,]\d+)?$/ : /^\d+$/).test(value)) throw new Error(`Número inválido no campo ${field}.`);
    return Number(value.replace(",", "."));
  }
  if (booleanFields.has(field)) {
    const normalized = value.toLowerCase();
    if (!["true", "false", "sim", "não", "nao", "1", "0"].includes(normalized)) {
      throw new Error(`Valor booleano inválido no campo ${field}.`);
    }
    return ["true", "sim", "1"].includes(normalized);
  }
  if (listFields.has(field)) {
    return value === "[]" ? [] : value.split("|").map((item) => item.trim());
  }
  if (field === "birth_date" || field === "death_date") {
    return value.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, "$3-$2-$1");
  }
  return value;
}

function main() {
  const [entity, file, partArg, delimiterArg] = process.argv.slice(2);
  const part = Number(partArg ?? 1);
  if (!entities.has(entity) || !file || !Number.isSafeInteger(part) || part < 1) {
    throw new Error('Uso: node scripts/import/planilha.mjs <composers|conductors|works> <arquivo.csv> [parte] [","|";"]');
  }
  if (statSync(file).size > 10 * 1024 * 1024) throw new Error("Divida o CSV em arquivos de até 10 MiB.");
  const csv = new TextDecoder("utf-8", { fatal: true }).decode(readFileSync(file));
  const delimiter = delimiterArg ?? (csv.split(/\r?\n/, 1)[0].includes(";") ? ";" : ",");
  if (![",", ";"].includes(delimiter)) throw new Error("Use vírgula ou ponto e vírgula como delimitador.");

  const records = parse(csv, {
    bom: true,
    delimiter,
    trim: true,
    skip_empty_lines: true,
    columns(headers) {
      const fields = headers.map((header) => header.trim());
      if (!fields.includes("slug") || fields.some((field) => !/^[a-z_][a-z0-9_]*$/.test(field)) ||
        new Set(fields).size !== fields.length) {
        throw new Error("Use cabeçalhos distintos do contrato e inclua a coluna slug.");
      }
      return fields;
    },
  }).filter((record) => Object.values(record).some(Boolean));

  const offset = (part - 1) * 100;
  const rows = records.slice(offset, offset + 100).map((record, index) => {
    try {
      if (!record.slug) throw new Error("O slug é obrigatório.");
      return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== "")
        .map(([field, value]) => [field, valueFor(field, value)]));
    } catch (error) {
      throw new Error(`Registro ${offset + index + 1}. ${error.message}`);
    }
  });
  if (!rows.length) throw new Error("A parte solicitada não tem registros.");

  const totalParts = Math.ceil(records.length / 100);
  const file_name = totalParts > 1 ? `${basename(file)} (${part}/${totalParts})` : basename(file);
  const payload = JSON.stringify({ entity, file_name, rows }, null, 2);
  if (Buffer.byteLength(payload) > 1_040_000) throw new Error("Esta parte é grande demais. Divida o CSV em arquivos menores.");
  console.error(`${rows.length} registros da parte ${part}/${totalParts}.`);
  console.log(payload);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
