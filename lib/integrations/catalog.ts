import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/env";
import { ApiError } from "./http";
import { importRows, type CatalogEntity, type CatalogImport } from "./schemas";

export function integrationClient(token?: string) {
  const { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: key } = publicEnv;
  if (!url || !key) throw new ApiError(503, "Catálogo temporariamente indisponível.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
}

const composerColumns = "slug,canonical_name,display_name,surname,birth_year,death_year,birth_city,birth_state,short_biography,long_biography";
const conductorColumns = "slug,canonical_name,display_name,birth_year,death_year,short_biography,long_biography";
const workColumns = "slug,canonical_title,display_title,composition_year_start,composition_year_end,composition_date_text,opus,catalog,catalog_number,duration_minutes,formation_type,public_summary,composers(slug,display_name)";

function normalizedSearch(input: string) {
  return input.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export async function readCatalog({
  entity, q, slug, limit = 25, offset = 0,
}: { entity: CatalogEntity; q?: string; slug?: string; limit?: number; offset?: number }) {
  const db = integrationClient();
  const options = { count: "exact" as const };
  const query = entity === "composers"
    ? db.from("composers").select(composerColumns, options).order("display_name")
    : entity === "conductors"
      ? db.from("conductors").select(conductorColumns, options).order("display_name")
      : db.from("works").select(workColumns, options).order("display_title");

  query.eq("publication_status", "published").order("slug").range(offset, offset + limit - 1);
  if (slug) query.eq("slug", slug);
  if (q) {
    const name = normalizedSearch(q);
    if (!name) return { entity, data: [], limit, offset, total: 0 };
    query.like("search_document", `%${name.replaceAll(" ", "%")}%`);
  }

  const { data, count, error } = await query;
  if (error?.code === "PGRST103" && offset > 0) {
    return { entity, data: [], limit, offset, total: count ?? 0 };
  }
  if (error) throw new ApiError(503, "Não foi possível consultar o catálogo.");
  return { entity, data: data ?? [], limit, offset, total: count ?? 0 };
}

export function bearer(request: Request) {
  const token = /^Bearer ([^\s,]+)$/i.exec(request.headers.get("authorization") ?? "")?.[1];
  if (!token) throw new ApiError(401, "Informe um token de acesso do Supabase.");
  return token;
}

export async function editorialClient(token: string) {
  const db = integrationClient(token);
  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user) {
    if (error?.status === 429) throw new ApiError(429, "Muitas tentativas. Tente novamente em instantes.");
    if (error?.status && error.status >= 500) throw new ApiError(503, "Autenticação temporariamente indisponível.");
    throw new ApiError(401, "Sessão inválida ou expirada. Entre novamente.");
  }

  const { data: profile, error: profileError } = await db.from("profiles")
    .select("role,status").eq("id", user.id).maybeSingle();
  if (profileError) throw new ApiError(503, "Não foi possível verificar a permissão editorial.");
  if (profile?.status !== "active" || !["editor", "admin"].includes(profile.role)) {
    throw new ApiError(403, "A importação requer uma conta ativa de editor ou administrador.");
  }
  return db;
}

export async function importCatalog(input: CatalogImport, db: Awaited<ReturnType<typeof editorialClient>>) {
  const rowSchema = importRows[input.entity];
  const validated = input.rows.map((row, index) => ({ row: index + 1, result: rowSchema.safeParse(row) }));
  const invalid = validated.flatMap(({ row, result }) => result.success ? [] : [{ row, issues: result.error.issues }]);
  if (invalid.length) throw new ApiError(400, "Corrija as linhas do lote.", invalid);

  const { data, error } = await db.rpc("import_catalog_v1", {
    entity: input.entity, rows: validated.flatMap(({ result }) => result.success ? [result.data] : []),
    file_name: input.file_name,
    dry_run: input.mode === "preview", expected_plan: input.mode === "apply" ? input.plan : null,
  });

  if (error) {
    const row = /^(?:[1-9]|[1-9][0-9]|100)$/.test(error.details ?? "") ? Number(error.details) : undefined;
    const details = row ? { row } : undefined;
    if (error.code === "42501") throw new ApiError(403, "Permissão editorial insuficiente.");
    if (error.code === "PBO02") throw new ApiError(409, "O lote ou os registros mudaram. Gere outra prévia antes de aplicar.");
    if (error.code === "23505" || error.code === "40P01" || error.code === "40001") {
      throw new ApiError(409, "Conflito de edição. Confira os slugs e gere outra prévia.", details);
    }
    if (error.code === "22023") throw new ApiError(400, error.message, details);
    if (error.code?.startsWith("22") || error.code?.startsWith("23")) {
      throw new ApiError(400, "Uma linha não atende às restrições do catálogo.", details);
    }
    throw new ApiError(503, "Não foi possível processar o lote.");
  }
  return data as unknown;
}
