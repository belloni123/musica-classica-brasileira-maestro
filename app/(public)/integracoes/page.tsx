import Link from "next/link";
import { Card } from "@/components/ui/card";

export const metadata = { title: "API e MCP | Brasil Orquestral" };

export default function IntegrationsPage() {
  return (
    <section className="grid max-w-4xl gap-6">
      <div className="border-b border-[var(--border-strong)] pb-4">
        <h1 className="text-4xl">API e MCP</h1>
        <p className="mt-3 text-lg text-[var(--muted-foreground)]">
          Consulte obras, compositores e maestros publicados com login e conta ativa. Editores e administradores ativos podem validar e importar lotes.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="grid content-start gap-3">
          <h2 className="text-2xl">API REST</h2>
          <p>Pesquisa em JSON com filtros por nome, título ou slug. O contrato OpenAPI documenta a consulta e a importação.</p>
          <Link className="w-fit underline underline-offset-4" href="/api/v1/openapi.json">Contrato OpenAPI</Link>
          <p>Envie seu token de acesso no cabeçalho <code>Authorization: Bearer</code> em cada consulta.</p>
          <code className="overflow-x-auto bg-[var(--muted)] p-3 text-sm">GET /api/v1/catalog/works?limit=5</code>
        </Card>
        <Card className="grid content-start gap-3">
          <h2 className="text-2xl">MCP</h2>
          <p>Conecte o Claude Code pelo transporte Streamable HTTP com seu token de acesso. A conexão exige login e conta ativa.</p>
          <code className="overflow-x-auto bg-[var(--muted)] p-3 text-sm">/api/mcp</code>
          <a className="w-fit underline underline-offset-4" href="https://github.com/belloni123/musica-classica-brasileira-maestro/blob/main/docs/claude-code.md">
            Guia de integração com Claude Code
          </a>
        </Card>
      </div>
    </section>
  );
}
