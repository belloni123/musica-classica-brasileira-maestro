import { createSourceHolder } from "@/app/admin/fontes/actions";
import { SourceHolderForm } from "@/components/forms/source-holder-form";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { requireEditorialWriteAccess } from "@/lib/auth/session";

export default async function NewSourceHolderPage() {
  await requireEditorialWriteAccess();

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Nova fonte"
          description="Cadastre editoras, acervos, bibliotecas, instituições, websites e contatos."
        />
        <SourceHolderForm action={createSourceHolder} submitLabel="Criar fonte" />
      </section>
    </>
  );
}
