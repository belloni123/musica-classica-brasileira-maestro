import { createInstrument } from "@/app/admin/instrumentos/actions";
import { InstrumentForm, type InstrumentFamilyOption } from "@/components/forms/instrument-form";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

async function fetchFamilies() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instrument_families")
    .select("id,name")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Erro ao carregar familias instrumentais: ${error.message}`);
  }

  return (data ?? []) as InstrumentFamilyOption[];
}

export default async function NewInstrumentPage() {
  await requireEditorialWriteAccess();
  const families = await fetchFamilies();

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Novo instrumento"
          description="Cadastre instrumentos normalizados para busca e instrumentação estruturada."
        />
        <InstrumentForm action={createInstrument} families={families} submitLabel="Criar instrumento" />
      </section>
    </>
  );
}
