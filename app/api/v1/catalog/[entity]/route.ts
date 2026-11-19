import { z } from "zod";
import { activeAccount, bearer, readCatalog } from "@/lib/integrations/catalog";
import { jsonError, publicHeaders, validate } from "@/lib/integrations/http";
import { catalogQuery } from "@/lib/integrations/schemas";

const headers = { ...publicHeaders, "Cache-Control": "private, no-store", Vary: "Authorization" };

export async function GET(request: Request, context: { params: Promise<{ entity: string }> }) {
  try {
    await activeAccount(bearer(request));
    const { entity } = await context.params;
    const params = new URL(request.url).searchParams;
    const input = validate(z.object({
      ...catalogQuery,
      limit: z.coerce.number().pipe(catalogQuery.limit.unwrap()).optional(),
      offset: z.coerce.number().pipe(catalogQuery.offset.unwrap()).optional(),
    }), { ...Object.fromEntries(params), entity });
    return Response.json(await readCatalog(input), {
      headers,
    });
  } catch (error) {
    return jsonError(error, headers);
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: {
    ...headers, "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Authorization",
  } });
}
