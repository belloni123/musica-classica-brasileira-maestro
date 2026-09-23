type ComposerName = { display_name: string; canonical_name: string; surname?: string | null };

export const brazilianStates = [
  ["Acre", "AC"], ["Alagoas", "AL"], ["Amapá", "AP"], ["Amazonas", "AM"], ["Bahia", "BA"],
  ["Ceará", "CE"], ["Distrito Federal", "DF"], ["Espírito Santo", "ES"], ["Goiás", "GO"],
  ["Maranhão", "MA"], ["Mato Grosso", "MT"], ["Mato Grosso do Sul", "MS"], ["Minas Gerais", "MG"],
  ["Pará", "PA"], ["Paraíba", "PB"], ["Paraná", "PR"], ["Pernambuco", "PE"], ["Piauí", "PI"],
  ["Rio de Janeiro", "RJ"], ["Rio Grande do Norte", "RN"], ["Rio Grande do Sul", "RS"],
  ["Rondônia", "RO"], ["Roraima", "RR"], ["Santa Catarina", "SC"], ["São Paulo", "SP"],
  ["Sergipe", "SE"], ["Tocantins", "TO"],
] as const;

// The editorial display heading takes precedence (e.g. Garcia, José Maurício Nunes).
export function composerSortName(composer: ComposerName) {
  const display = composer.display_name.trim();
  return display.includes(",") ? display : `${composer.surname?.trim() || display || composer.canonical_name}, ${display}`;
}

export function composerIndexLetter(composer: ComposerName) {
  return composerSortName(composer).normalize("NFD").replace(/\p{Diacritic}/gu, "").charAt(0).toUpperCase();
}

export function sortComposers<T extends ComposerName>(composers: T[], letter = "") {
  const collator = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true });
  return composers.filter(composer => !letter || composerIndexLetter(composer) === letter)
    .sort((a, b) => collator.compare(composerSortName(a), composerSortName(b)));
}

const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function composerBirthplace(city?: string | null, state?: string | null) {
  const rawState = state?.trim() || "";
  const uf = brazilianStates.find(([name, code]) => normalize(name) === normalize(rawState) || code.toLowerCase() === rawState.toLowerCase())?.[1] || rawState;
  return [city?.trim(), uf].filter(Boolean).join(" — ") || "Naturalidade não informada";
}
