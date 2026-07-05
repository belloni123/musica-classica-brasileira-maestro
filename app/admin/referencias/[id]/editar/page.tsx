import { notFound } from "next/navigation";
import { updateReference } from "@/app/admin/referencias/actions";
import { ReferenceForm } from "@/components/forms/reference-form";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditReferencePage({ params }: PageProps) {
  await requireEditorialWriteAccess();
  const { id } = await params;
  const supabase = await createClient();
  const { data: reference, error } = await supabase
    .from("bibliographic_references")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !reference) {
    notFound();
  }

  const updateAction = updateReference.bind(null, id);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader title="Editar referência" description={reference.title} />
        <ReferenceForm action={updateAction} reference={reference} submitLabel="Salvar alterações" />
      </section>
    </>
  );
}
