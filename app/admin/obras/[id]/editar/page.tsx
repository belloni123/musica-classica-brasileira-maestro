import { notFound } from "next/navigation";
import { Archive, CheckCircle2 } from "lucide-react";
import { archiveWork, publishWork, updateWork } from "@/app/admin/obras/actions";
import { WorkForm, type ComposerOption } from "@/components/forms/work-form";
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

export default async function EditWorkPage({ params }: PageProps) {
  await requireEditorialWriteAccess();
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: work, error }, composers] = await Promise.all([
    supabase.from("works").select("*").eq("id", id).single(),
    fetchComposers(),
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
      </section>
    </>
  );
}
