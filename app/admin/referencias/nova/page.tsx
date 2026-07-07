import { createReference } from "@/app/admin/referencias/actions";
import { ReferenceForm } from "@/components/forms/reference-form";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { requireEditorialWriteAccess } from "@/lib/auth/session";

export default async function NewReferencePage() {
  await requireEditorialWriteAccess();

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Nova referência"
          description="Cadastre referências bibliográficas para vínculo com compositores e obras."
        />
        <ReferenceForm action={createReference} submitLabel="Criar referência" />
      </section>
    </>
  );
}
