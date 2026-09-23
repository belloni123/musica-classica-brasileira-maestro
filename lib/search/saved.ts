export const savedSearchKeys = ["compositor","titulo","q","nacionalidade","estado_nascimento","regiao_brasileira","nascimento_de","nascimento_ate","falecimento_de","falecimento_ate","genero","composicao_de","composicao_ate","duracao_de","duracao_ate","formacao","instrumentacao","solista_instrumental","solista_vocal","coro","sem_coro","solista","obra_didatica","orquestra_jovem","qtd_flautas","qtd_oboes","qtd_clarinetes","qtd_fagotes","qtd_trompas","qtd_trompetes","qtd_trombones","qtd_tubas","timpanos","cordas"];

export function savedSearchUrl(parameters: Record<string, unknown>) {
  const query = new URLSearchParams();
  for (const key of savedSearchKeys) {
    const value = parameters[key];
    if (typeof value === "string" && value.length <= 100) query.set(key, value);
  }
  return `${parameters.path === "/busca-avancada" ? "/busca-avancada" : "/buscar"}?${query.toString()}`;
}
