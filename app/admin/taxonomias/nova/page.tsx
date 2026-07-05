import { createTaxonomy } from "@/app/admin/taxonomias/actions";
import { TaxonomyForm } from "@/components/forms/taxonomy-form";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { requireEditorialWriteAccess } from "@/lib/auth/session";

export default async function NewTaxonomyPage() {
  await requireEditorialWriteAccess();

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Nova taxonomia"
          description="Crie classificações controladas para busca, curadoria e organização editorial."
        />
        <TaxonomyForm action={createTaxonomy} submitLabel="Criar taxonomia" />
      </section>
    </>
  );
}
