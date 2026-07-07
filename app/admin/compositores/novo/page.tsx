import { AdminNav } from "@/components/layout/admin-nav";
import { ComposerForm } from "@/components/forms/composer-form";
import { createComposer } from "@/app/admin/compositores/actions";
import { requireEditorialWriteAccess } from "@/lib/auth/session";

export default async function NewComposerPage() {
  await requireEditorialWriteAccess();

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Novo compositor</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            O sistema gera o slug automaticamente a partir do nome canônico.
          </p>
        </div>
        <ComposerForm action={createComposer} submitLabel="Criar compositor" />
      </section>
    </>
  );
}
