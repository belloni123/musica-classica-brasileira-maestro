import { notFound } from "next/navigation";
import { Archive, CheckCircle2 } from "lucide-react";
import { archiveWork, publishWork, updateWork } from "@/app/admin/obras/actions";
import { WorkForm, type ComposerOption } from "@/components/forms/work-form";
import {
  WorkInstrumentationSection,
  type InstrumentOption,
  type WorkInstrumentationRow,
} from "@/components/forms/work-instrumentation-section";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

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

async function fetchInstruments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instruments")
    .select("id,name,family")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Erro ao carregar instrumentos: ${error.message}`);
  }

  return (data ?? []) as InstrumentOption[];
}

async function fetchInstrumentationRows(workId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_instrumentation")
    .select(
      "id,instrument_id,minimum_quantity,maximum_quantity,quantity_text,required,optional,doubling,doubled_instrument_id,substitutable,notes,source",
    )
    .eq("work_id", workId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Erro ao carregar instrumentacao: ${error.message}`);
  }

  return (data ?? []) as WorkInstrumentationRow[];
}

export default async function EditWorkPage({ params }: PageProps) {
  await requireEditorialWriteAccess();
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: work, error }, composers, instruments, instrumentationRows] = await Promise.all([
    supabase.from("works").select("*").eq("id", id).single(),
    fetchComposers(),
    fetchInstruments(),
    fetchInstrumentationRows(id),
  ]);

  if (error || !work) {
    notFound();
  }

  const updateAction = updateWork.bind(null, id);
  const publishAction = publishWork.bind(null, id);
  const archiveAction = archiveWork.bind(null, id);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Editar obra"
          description={`${work.display_title} · ${work.publication_status}`}
          action={
            <div className="flex flex-wrap gap-2">
              <form action={publishAction}>
                <Button type="submit" variant="secondary">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Publicar
                </Button>
              </form>
              <form action={archiveAction}>
                <Button type="submit" variant="secondary">
                  <Archive size={16} aria-hidden="true" />
                  Arquivar
                </Button>
              </form>
            </div>
          }
        />
        <WorkForm
          action={updateAction}
          composers={composers}
          submitLabel="Salvar alterações"
          work={work}
        />
        <WorkInstrumentationSection
          instruments={instruments}
          rows={instrumentationRows}
          workId={id}
        />
      </section>
    </>
  );
}
