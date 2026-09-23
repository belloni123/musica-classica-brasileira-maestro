export const orchestralInstruments = [
  { key: "flautas", name: "Flauta", label: "Flautas" },
  { key: "oboes", name: "Oboé", label: "Oboés" },
  { key: "clarinetes", name: "Clarinete", label: "Clarinetes" },
  { key: "fagotes", name: "Fagote", label: "Fagotes" },
  { key: "trompas", name: "Trompa", label: "Trompas" },
  { key: "trompetes", name: "Trompete", label: "Trompetes" },
  { key: "trombones", name: "Trombone", label: "Trombones" },
  { key: "tubas", name: "Tuba", label: "Tubas" },
] as const;

type Instrument = { name: string };
export type InstrumentationRow = {
  minimum_quantity: number | null;
  maximum_quantity: number | null;
  quantity_text: string | null;
  optional?: boolean;
  doubling?: boolean;
  role?: string | null;
  instruments: Instrument | Instrument[] | null;
};
const normalized = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
export function instrumentName(row: InstrumentationRow) {
  return (Array.isArray(row.instruments) ? row.instruments[0] : row.instruments)?.name || "Instrumento";
}
function bounds(row: InstrumentationRow): [number, number] | null {
  if (row.minimum_quantity !== null || row.maximum_quantity !== null) {
    return [row.minimum_quantity ?? 0, row.maximum_quantity ?? Infinity];
  }
  const text = row.quantity_text?.trim() || "";
  if (/^\d+$/.test(text)) return [Number(text), Number(text)];
  const range = text.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  return range ? [Number(range[1]), Number(range[2])] : null;
}
function quantityCode(rows: InstrumentationRow[]) {
  if (!rows.length) return "0";
  const quantities = rows.map(bounds);
  if (quantities.some(value => !value)) return "?";
  const min = quantities.reduce((sum, value) => sum + value![0], 0);
  const max = quantities.reduce((sum, value) => sum + value![1], 0);
  const code = min === max ? String(min) : max === Infinity ? `${min}+` : `${min}–${max}`;
  return rows.some(row => row.optional || row.doubling || row.role) ? `${code}*` : code;
}
const stringNames = ["violino", "viola", "violoncelo", "contrabaixo", "cordas", "strings"];
function isStrings(row: InstrumentationRow) { return stringNames.includes(normalized(instrumentName(row))); }
function isTimpani(row: InstrumentationRow) { return ["timpanos", "timpano", "timpani"].includes(normalized(instrumentName(row))); }
const matching = (rows: InstrumentationRow[], name: string) => rows.filter(row => normalized(instrumentName(row)) === normalized(name));

const codeOrder = orchestralInstruments.map(instrument => normalized(instrument.name));
const stringOrder = ["cordas", "strings", "violino", "viola", "violoncelo", "contrabaixo"];
const timpaniNames = ["timpanos", "timpano", "timpani"];

/** Show instruments in the same sequence as the orchestral code, not insertion order. */
export function sortInstrumentationRows<T>(rows: readonly T[], getName: (row: T) => string): T[] {
  function position(name: string) {
    const value = normalized(name);
    const windIndex = codeOrder.indexOf(value);
    if (windIndex !== -1) return [windIndex, 0] as const;
    if (timpaniNames.includes(value)) return [codeOrder.length, 0] as const;
    const stringIndex = stringOrder.indexOf(value);
    if (stringIndex !== -1) return [codeOrder.length + 1, stringIndex] as const;
    return [codeOrder.length + 2, 0] as const;
  }
  return [...rows].sort((a, b) => {
    const nameA = getName(a);
    const nameB = getName(b);
    const [groupA, indexA] = position(nameA);
    const [groupB, indexB] = position(nameB);
    return groupA - groupB || indexA - indexB || nameA.localeCompare(nameB, "pt-BR", { sensitivity: "base" });
  });
}

export function instrumentationCode(rows: InstrumentationRow[]) {
  if (!rows.length) return null;
  const quantities = orchestralInstruments.map(instrument => quantityCode(matching(rows, instrument.name)));
  const suffixes: string[] = [];
  if (rows.some(isTimpani)) suffixes.push("Tmp");
  if (rows.some(isStrings)) suffixes.push("Str");
  const extras = rows.filter(row => !isTimpani(row) && !isStrings(row) &&
    !orchestralInstruments.some(instrument => normalized(instrument.name) === normalized(instrumentName(row))));
  // Other instruments are never discarded or mistaken for one of the eight wind slots.
  for (const row of extras) suffixes.push(`${instrumentName(row)} (${quantityCode([row])})`);
  return [quantities.slice(0, 4).join(" "), quantities.slice(4).join(" "), ...suffixes].join(" - ");
}

export type InstrumentationCriteria = { quantities: Record<string, number>; timpani: boolean; strings: boolean };
export function instrumentationCriteria(params: Record<string, string | undefined>): InstrumentationCriteria {
  const quantities: Record<string, number> = {};
  for (const instrument of orchestralInstruments) {
    const raw = params[`qtd_${instrument.key}`]?.trim();
    if (!raw) continue;
    if (!/^\d+$/.test(raw) || Number(raw) > 1000) throw new Error("Informe quantidades inteiras de 0 a 1000 para os instrumentos.");
    quantities[instrument.name] = Number(raw);
  }
  return { quantities, timpani: params.timpanos === "on", strings: params.cordas === "on" };
}
export function hasInstrumentationCriteria(criteria: InstrumentationCriteria) {
  return Object.keys(criteria.quantities).length > 0 || criteria.timpani || criteria.strings;
}
export function matchesInstrumentation(rows: InstrumentationRow[], criteria: InstrumentationCriteria) {
  if (criteria.timpani && !rows.some(isTimpani)) return false;
  if (criteria.strings && !rows.some(isStrings)) return false;
  return Object.entries(criteria.quantities).every(([name, requested]) => {
    const selected = matching(rows, name);
    // Missing data is not evidence that the piece requires zero players.
    if (!selected.length) return false;
    const quantities = selected.map(bounds);
    if (quantities.some(value => !value)) return false;
    const min = quantities.reduce((sum, value) => sum + value![0], 0);
    const max = quantities.reduce((sum, value) => sum + value![1], 0);
    return requested >= min && requested <= max;
  });
}
