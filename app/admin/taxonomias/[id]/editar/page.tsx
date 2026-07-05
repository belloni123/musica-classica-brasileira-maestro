import { notFound } from "next/navigation";
import { updateTaxonomy } from "@/app/admin/taxonomias/actions";
import { TaxonomyForm } from "@/components/forms/taxonomy-form";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTaxonomyPage({ params }: PageProps) {
  await requireEditorialWriteAccess();
  const { id } = await params;
  const supabase = await createClient();
  const { data: taxonomy, error } = await supabase
    .from("taxonomies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !taxonomy) {
    notFound();
  }

  const updateAction = updateTaxonomy.bind(null, id);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader title="Editar taxonomia" description={taxonomy.name} />
        <TaxonomyForm action={updateAction} submitLabel="Salvar alterações" taxonomy={taxonomy} />
      </section>
    </>
  );
}
