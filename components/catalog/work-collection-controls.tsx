import Link from "next/link";
import { addToList, setFavorite } from "@/app/(account)/actions";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export async function WorkCollectionControls({ workId }: { workId: string }) {
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();
  const [favorite, lists] = await Promise.all([
    supabase.from("favorites").select("id").eq("user_id", user.id).eq("work_id", workId).maybeSingle(),
    supabase.from("repertoire_lists").select("id,name").eq("user_id", user.id).order("name"),
  ]);
  if (favorite.error || lists.error) throw new Error("Não foi possível carregar suas coleções.");
  return <Card className="flex flex-wrap items-center gap-4">
    <form action={setFavorite.bind(null, workId, !favorite.data)}><Button type="submit" variant="secondary">{favorite.data ? "Remover dos favoritos" : "Salvar nos favoritos"}</Button></form>
    {lists.data?.length ? <form action={addToList.bind(null, workId)} className="flex flex-wrap items-center gap-2">
      <label>Lista <select name="list_id" className="rounded border p-2" required>{lists.data.map(list => <option key={list.id} value={list.id}>{list.name}</option>)}</select></label>
      <Button type="submit">Adicionar à lista</Button>
    </form> : <Link className="underline" href="/listas">Criar lista de repertório</Link>}
  </Card>;
}
