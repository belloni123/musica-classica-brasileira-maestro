export const orchestraTypes = [
  "Orquestra de cordas",
  "Orquestra de câmara",
  "Orquestra sinfônica",
] as const;

export const brazilianRegions = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;

export const choirVoices = ["Soprano", "Contralto", "Tenor", "Baixo"] as const;

export function compositionYearLabel(start?: number | null, end?: number | null, text?: string | null) {
  if (start != null && end != null && start !== end) return `${start}–${end}`;
  return String(start ?? end ?? (text?.trim() || "s/d"));
}
