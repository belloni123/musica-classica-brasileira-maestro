import { bearer, editorialClient, importCatalog } from "@/lib/integrations/catalog";
import { jsonError, readJson, validate } from "@/lib/integrations/http";
import { importRequest } from "@/lib/integrations/schemas";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  try {
    const token = bearer(request);
    const input = validate(importRequest, await readJson(request));
    return Response.json(await importCatalog(input, await editorialClient(token)), { headers });
  } catch (error) {
    return jsonError(error, headers);
  }
}
