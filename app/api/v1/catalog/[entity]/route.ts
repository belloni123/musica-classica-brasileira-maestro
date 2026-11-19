import { z } from "zod";
import { readCatalog } from "@/lib/integrations/catalog";
import { jsonError, publicHeaders, validate } from "@/lib/integrations/http";
import { catalogQuery } from "@/lib/integrations/schemas";

export async function GET(request: Request, context: { params: Promise<{ entity: string }> }) {
  try {
    const { entity } = await context.params;
    const params = new URL(request.url).searchParams;
    const input = validate(z.object({
      ...catalogQuery,
      limit: z.coerce.number().pipe(catalogQuery.limit.unwrap()).optional(),
      offset: z.coerce.number().pipe(catalogQuery.offset.unwrap()).optional(),
    }), { ...Object.fromEntries(params), entity });
    return Response.json(await readCatalog(input), {
      headers: { ...publicHeaders, "Cache-Control": "public, max-age=0, s-maxage=30" },
    });
  } catch (error) {
    return jsonError(error, publicHeaders);
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...publicHeaders, "Access-Control-Allow-Methods": "GET, OPTIONS" } });
}
