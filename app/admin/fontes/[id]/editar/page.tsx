import { notFound } from "next/navigation";
import { setSourceHolderActive, updateSourceHolder } from "@/app/admin/fontes/actions";
import { SourceHolderForm } from "@/components/forms/source-holder-form";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSourceHolderPage({ params }: PageProps) {
  await requireEditorialWriteAccess();
  const { id } = await params;
  const supabase = await createClient();
  const { data: source, error } = await supabase
    .from("source_holders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !source) {
    notFound();
  }

  const updateAction = updateSourceHolder.bind(null, id);
  const toggleAction = setSourceHolderActive.bind(null, id, !source.active);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Editar fonte"
          description={`${source.name} · ${source.active ? "ativa" : "inativa"}`}
          action={
            <form action={toggleAction}>
              <Button type="submit" variant="secondary">
                {source.active ? "Desativar" : "Ativar"}
              </Button>
            </form>
          }
        />
        <SourceHolderForm action={updateAction} source={source} submitLabel="Salvar alterações" />
      </section>
    </>
  );
}
