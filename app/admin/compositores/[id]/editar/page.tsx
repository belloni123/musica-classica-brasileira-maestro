import { notFound } from "next/navigation";
import { Archive, CheckCircle2 } from "lucide-react";
import { AdminNav } from "@/components/layout/admin-nav";
import { ComposerForm } from "@/components/forms/composer-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  archiveComposer,
  publishComposer,
  updateComposer,
} from "@/app/admin/compositores/actions";
import {
  getCurrentProfile,
  hasEditorialWriteAccess,
  requireAdminAccess,
} from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type EditComposerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditComposerPage({ params }: EditComposerPageProps) {
  await requireAdminAccess();
  const { id } = await params;
  const profile = await getCurrentProfile();
  const canWrite = hasEditorialWriteAccess(profile);
  const supabase = await createClient();
  const { data: composer, error } = await supabase
    .from("composers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !composer) {
    notFound();
  }

  const updateAction = updateComposer.bind(null, id);
  const publishAction = publishComposer.bind(null, id);
  const archiveAction = archiveComposer.bind(null, id);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Editar compositor</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Status editorial: {composer.publication_status}
            </p>
          </div>
          {canWrite ? (
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
          ) : null}
        </div>
        {canWrite ? (
          <ComposerForm action={updateAction} composer={composer} submitLabel="Salvar alteracoes" />
        ) : (
          <Card>
            <p className="text-sm text-[var(--muted-foreground)]">
              Seu papel permite revisao e leitura administrativa, mas nao permite editar compositores.
            </p>
          </Card>
        )}
      </section>
    </>
  );
}
