export function cleanText(value?: string) {
  return String(value ?? "").normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s'".-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 100);
}

export function searchPattern(value?: string) {
  const normalized = cleanText(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return normalized ? `%${normalized.split(/\s+/).join("%")}%` : "";
}

export function cleanNumber(value?: string) {
  if (value === undefined || value.trim() === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100000) {
    throw new Error("Informe números válidos, maiores ou iguais a zero.");
  }
  return parsed;
}

export function validateSearchRanges(params: Record<string, string | undefined>) {
  for (const key of ["nascimento", "falecimento", "composicao", "duracao"]) {
    const from = cleanNumber(params[`${key}_de`]);
    const to = cleanNumber(params[`${key}_ate`]);
    if (from !== null && to !== null && from > to) throw new Error("O início do intervalo deve ser menor ou igual ao fim.");
  }
  if (params.coro && params.sem_coro) throw new Error("Escolha com coro ou sem coro, não ambos.");
}

export function pageNumber(value?: string) {
  const n = Number(value);
  return Number.isSafeInteger(n) && n > 0 ? Math.min(n, 10000) : 1;
}
