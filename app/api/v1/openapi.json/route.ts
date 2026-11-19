import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { publicHeaders } from "@/lib/integrations/http";
import { batchInput, entities, importRows, planField } from "@/lib/integrations/schemas";

const slug = { type: "string", maxLength: 160, pattern: "^[a-z0-9]+(-[a-z0-9]+)*$" };
const entity = { type: "string", enum: entities };

function importSchema() {
  function inline(schema: z.ZodTypeAny) {
    const { $schema, ...definition } = zodToJsonSchema(schema, { $refStrategy: "none" });
    void $schema;
    return definition;
  }
  return { oneOf: entities.flatMap((name) => {
    const shape = { ...batchInput, entity: z.literal(name), rows: importRows[name].array().min(1).max(100) };
    return [
      inline(z.object({ ...shape, mode: z.literal("preview") }).strict()),
      inline(z.object({ ...shape, mode: z.literal("apply"), plan: planField }).strict()),
    ];
  }) };
}

const success = (schema: object) => ({
  description: "Sucesso", content: { "application/json": { schema } },
});
const error = (description: string) => ({
  description,
  content: { "application/json": { schema: { type: "object", required: ["error"], properties: {
    error: { type: "string" }, details: {},
  } } } },
});

export function GET() {
  return Response.json({
    openapi: "3.1.0",
    info: { title: "Brasil Orquestral", version: "1.0.0" },
    externalDocs: { url: "https://github.com/belloni123/musica-classica-brasileira-maestro/blob/main/docs/claude-code.md" },
    paths: {
      "/api/v1/catalog/{entity}": {
        get: {
          operationId: "consultarCatalogo",
          summary: "Consulta de registros publicados com login e conta ativa",
          security: [{ accountToken: [] }],
          parameters: [
            { name: "entity", in: "path", required: true, schema: entity },
            { name: "q", in: "query", schema: { type: "string", maxLength: 100 } },
            { name: "slug", in: "query", schema: slug },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
            { name: "offset", in: "query", schema: { type: "integer", minimum: 0, maximum: 100000, default: 0 } },
          ],
          responses: {
            200: success({ type: "object", required: ["entity", "data", "total", "limit", "offset"], properties: {
              entity, data: { type: "array", items: { type: "object", required: ["slug"], properties: { slug } } }, total: { type: "integer" },
              limit: { type: "integer" }, offset: { type: "integer" },
            } }),
            400: error("Parâmetros inválidos"), 401: error("Sessão ausente, inválida ou expirada"),
            403: error("Conta inativa ou perfil ausente"), 429: error("Limite temporário de autenticação"),
            503: error("Serviço temporariamente indisponível"),
          },
        },
      },
      "/api/v1/imports": {
        post: {
          operationId: "importarCatalogo",
          summary: "Valida ou aplica um lote editorial",
          security: [{ editorialToken: [] }],
          requestBody: { required: true, content: { "application/json": { schema: importSchema() } } },
          responses: {
            200: success({ type: "object", required: ["entity", "dry_run", "plan", "batch_id", "total", "changed", "rows"], properties: {
              entity, dry_run: { type: "boolean" }, plan: { type: "string" }, batch_id: { type: ["string", "null"], format: "uuid" },
              total: { type: "integer" }, changed: { type: "integer" }, rows: { type: "array", items: {
                type: "object", properties: {
                  row: { type: "integer" }, slug, action: { enum: ["create", "update", "unchanged"] },
                  previous_status: { type: ["string", "null"] }, publication_status: { type: "string" },
                  changed_fields: { type: "array", items: { type: "string" } },
                },
              } },
            } }),
            400: error("Lote inválido"), 401: error("Sessão ausente, inválida ou expirada"),
            403: error("Conta sem permissão editorial"), 409: error("Conflito. Gere uma nova prévia"),
            413: error("Corpo acima de 1 MiB"), 415: error("Formato diferente de application/json"),
            429: error("Limite temporário de autenticação"), 503: error("Serviço temporariamente indisponível"),
          },
        },
      },
    },
    components: { securitySchemes: {
      accountToken: {
        type: "http", scheme: "bearer", bearerFormat: "JWT",
        description: "Token de acesso do Supabase de usuário com perfil ativo. Qualquer papel pode consultar.",
      },
      editorialToken: {
        type: "http", scheme: "bearer", bearerFormat: "JWT",
        description: "Token de acesso do Supabase de Editor ou Administrador com perfil ativo.",
      },
    } },
  }, { headers: publicHeaders });
}
