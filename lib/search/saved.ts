export const savedSearchKeys = ["compositor","titulo","q","nacionalidade","nascimento_de","nascimento_ate","falecimento_de","falecimento_ate","genero","composicao_de","composicao_ate","duracao_de","duracao_ate","formacao","instrumentacao","solista_instrumental","solista_vocal","coro","sem_coro","solista","obra_didatica","orquestra_jovem"];

export function savedSearchUrl(parameters: Record<string, unknown>) {
  const query = new URLSearchParams();
  for (const key of savedSearchKeys) {
    const value = parameters[key];
    if (typeof value === "string" && value.length <= 100) query.set(key, value);
  }
  return `${parameters.path === "/busca-avancada" ? "/busca-avancada" : "/buscar"}?${query.toString()}`;
}
