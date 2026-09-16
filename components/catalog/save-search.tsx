import { saveSearch } from "@/app/(account)/actions";
import { getCurrentUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export async function SaveSearch({ params, path }: { params: Record<string, string | undefined>; path: string }) {
  if (!await getCurrentUser()) return null;
  return <form action={saveSearch.bind(null, params, path)} className="flex flex-wrap items-end gap-3">
    <label className="grid gap-1 text-sm">Nome desta pesquisa<Input name="name" maxLength={120} required placeholder="Meu repertório" /></label>
    <Button type="submit" variant="secondary">Salvar pesquisa</Button>
  </form>;
}
