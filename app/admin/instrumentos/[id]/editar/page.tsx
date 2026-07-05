import { notFound } from "next/navigation";
import { setInstrumentActive, updateInstrument } from "@/app/admin/instrumentos/actions";
import { InstrumentForm, type InstrumentFamilyOption } from "@/components/forms/instrument-form";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

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

export default async function EditInstrumentPage({ params }: PageProps) {
  await requireEditorialWriteAccess();
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: instrument, error }, families] = await Promise.all([
    supabase.from("instruments").select("*").eq("id", id).single(),
    fetchFamilies(),
  ]);

  if (error || !instrument) {
    notFound();
  }

  const updateAction = updateInstrument.bind(null, id);
  const toggleAction = setInstrumentActive.bind(null, id, !instrument.active);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Editar instrumento"
          description={`${instrument.name} · ${instrument.active ? "ativo" : "inativo"}`}
          action={
            <form action={toggleAction}>
              <Button type="submit" variant="secondary">
                {instrument.active ? "Desativar" : "Ativar"}
              </Button>
            </form>
          }
        />
        <InstrumentForm
          action={updateAction}
          families={families}
          instrument={instrument}
          submitLabel="Salvar alterações"
        />
      </section>
    </>
  );
}
