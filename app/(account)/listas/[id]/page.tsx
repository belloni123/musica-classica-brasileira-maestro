import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { deleteList, removeFromList } from "@/app/(account)/actions";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { firstRelated } from "@/lib/catalog/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ListPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const supabase = await createClient();
  const { data: list, error } = await supabase.from("repertoire_lists").select("id,name,description").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (error) throw new Error("Não foi possível abrir a lista.");
  if (!list) notFound();
  const { data: items, error: itemsError } = await supabase.from("repertoire_list_items").select("id,private_notes,works(display_title,slug)").eq("list_id", id).order("display_order").order("created_at");
  if (itemsError) throw new Error("Não foi possível carregar as obras da lista.");
  return <div className="grid gap-5">
    <Link href="/listas" className="underline">← Minhas listas</Link>
    <h1 className="text-3xl font-semibold">{list.name}</h1><p>{list.description}</p>
    <p className="text-sm">Lista privada. Adicione obras a partir da página de cada obra.</p>
    {items?.map(item => { const work=firstRelated(item.works); return <Card key={item.id} className="flex items-center justify-between gap-4">
      {work ? <Link href={`/obras/${work.slug}`} className="underline">{work.display_title}</Link> : <span>Obra indisponível</span>}
      <form action={removeFromList.bind(null,id,item.id)}><Button type="submit" variant="secondary">Remover</Button></form>
    </Card>; })}
    {!items?.length && <p>Esta lista ainda não tem obras. <Link className="underline" href="/buscar">Pesquisar repertório</Link></p>}
    <details className="mt-6"><summary className="cursor-pointer">Excluir esta lista</summary><p className="my-3 text-sm">A lista e seus itens serão excluídos. As obras do catálogo não serão alteradas.</p><form action={deleteList.bind(null,id)}><Button type="submit" variant="secondary">Confirmar exclusão da lista</Button></form></details>
  </div>;
}
