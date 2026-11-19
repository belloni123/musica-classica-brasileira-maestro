import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { activeAccount, bearer, editorialClient, importCatalog, readCatalog } from "@/lib/integrations/catalog";
import { ApiError, readJson, validate } from "@/lib/integrations/http";
import { batchInput, catalogQuery, importRequest, planField } from "@/lib/integrations/schemas";

const headers = { "Cache-Control": "private, no-store", Vary: "Authorization" };

function mcpError(status: number, code: number, message: string) {
  return Response.json({ jsonrpc: "2.0", error: { code, message }, id: null }, { status, headers });
}

async function toolResult(execute: () => Promise<unknown>) {
  try {
    const data = await execute();
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  } catch (error) {
    const failure = error instanceof ApiError ? error : new ApiError(503, "Serviço temporariamente indisponível.");
    return { isError: true, content: [{ type: "text" as const, text: JSON.stringify({
      status: failure.status, error: failure.message, details: failure.details,
    }) }] };
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? request.url).origin;
  if (origin && origin !== expectedOrigin) return mcpError(403, -32000, "Origem rejeitada.");

  let account: Awaited<ReturnType<typeof activeAccount>>;
  try {
    account = await activeAccount(bearer(request));
  } catch (error) {
    const failure = error instanceof ApiError ? error : new ApiError(503, "Autenticação temporariamente indisponível.");
    return mcpError(failure.status, -32000, failure.message);
  }

  let body: unknown;
  try {
    body = await readJson(request);
  } catch (error) {
    const failure = error instanceof ApiError ? error : new ApiError(400, "Solicitação inválida.");
    return mcpError(failure.status, -32700, failure.message);
  }

  const server = new McpServer({ name: "brasil-orquestral", version: "1.0.0" });
  server.registerTool("consultar_catalogo", {
    description: "Pesquisa obras, compositores e maestros publicados no Brasil Orquestral. Requer login e conta ativa.",
    inputSchema: catalogQuery,
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, (input) => toolResult(() => readCatalog(input)));

  if (["editor", "admin"].includes(account.profile.role)) {
    server.registerTool("prever_importacao", {
      description: "Valida um lote editorial de até 100 linhas. Retorna o plano e reverte todas as escritas da simulação.",
      inputSchema: batchInput,
      annotations: { readOnlyHint: true, openWorldHint: false },
    }, (input) => toolResult(async () => importCatalog(
      validate(importRequest, { ...input, mode: "preview" }), await editorialClient(bearer(request)),
    )));

    server.registerTool("aplicar_importacao", {
      description: "Aplica o mesmo lote usado na prévia com seu identificador de plano. Use após a aprovação do operador.",
      inputSchema: { ...batchInput, plan: planField },
      annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
    }, (input) => toolResult(async () => importCatalog(
      validate(importRequest, { ...input, mode: "apply" }), await editorialClient(bearer(request)),
    )));
  }

  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request, { parsedBody: body });
    for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
    return response;
  } finally {
    await server.close();
  }
}

export function GET() {
  return mcpError(405, -32000, "Este servidor MCP usa POST sem sessão.");
}

export const DELETE = GET;
