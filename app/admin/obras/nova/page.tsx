import { createWork } from "@/app/admin/obras/actions";
import { WorkForm, type ComposerOption } from "@/components/forms/work-form";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

async function fetchComposers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("composers")
    .select("id,display_name")
    .order("display_name", { ascending: true });

  if (error) {
    throw new Error(`Erro ao carregar compositores: ${error.message}`);
  }

  return (data ?? []) as ComposerOption[];
}

export default async function NewWorkPage() {
  await requireEditorialWriteAccess();
  const composers = await fetchComposers();

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Nova obra"
          description="Cadastre os dados gerais da obra e avance para a instrumentação estruturada."
        />
        <WorkForm action={createWork} composers={composers} submitLabel="Criar obra" />
      </section>
    </>
  );
}
