"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { savedSearchKeys } from "@/lib/search/saved";

const uuid = z.string().uuid();
const nameSchema = z.string().trim().min(1).max(120);

export async function setFavorite(workId: string, favorite: boolean) {
  uuid.parse(workId);
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();
  const result = favorite
    ? await supabase.from("favorites").upsert({ user_id: user.id, work_id: workId }, { onConflict: "user_id,work_id" })
    : await supabase.from("favorites").delete().eq("user_id", user.id).eq("work_id", workId);
  if (result.error) throw new Error("Não foi possível atualizar o favorito.");
  revalidatePath("/favoritos");
  revalidatePath("/obras/[slug]", "page");
}

export async function createList(formData: FormData) {
  const user = await requireAuthenticatedUser();
  const name = nameSchema.parse(formData.get("name"));
  const description = z.string().trim().max(1000).parse(formData.get("description") ?? "");
  const supabase = await createClient();
  const { data, error } = await supabase.from("repertoire_lists").insert({ user_id: user.id, name, description, private: true }).select("id").single();
  if (error || !data) throw new Error("Não foi possível criar a lista.");
  revalidatePath("/listas");
  redirect(`/listas/${data.id}`);
}

export async function deleteList(listId: string) {
  uuid.parse(listId);
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();
  const { error } = await supabase.from("repertoire_lists").delete().eq("id", listId).eq("user_id", user.id);
  if (error) throw new Error("Não foi possível excluir a lista.");
  revalidatePath("/listas");
  redirect("/listas");
}

export async function addToList(workId: string, formData: FormData) {
  uuid.parse(workId);
  const listId = uuid.parse(formData.get("list_id"));
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();
  const { data: list, error: listError } = await supabase.from("repertoire_lists").select("id").eq("id", listId).eq("user_id", user.id).maybeSingle();
  if (listError || !list) throw new Error("Lista não encontrada.");
  const { error } = await supabase.from("repertoire_list_items").upsert({ list_id: listId, work_id: workId }, { onConflict: "list_id,work_id", ignoreDuplicates: true });
  if (error) throw new Error("Não foi possível adicionar à lista.");
  revalidatePath(`/listas/${listId}`);
  redirect(`/listas/${listId}`);
}

export async function removeFromList(listId: string, itemId: string) {
  uuid.parse(listId); uuid.parse(itemId);
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();
  const { data: list } = await supabase.from("repertoire_lists").select("id").eq("id", listId).eq("user_id", user.id).maybeSingle();
  if (!list) throw new Error("Lista não encontrada.");
  const { error } = await supabase.from("repertoire_list_items").delete().eq("id", itemId).eq("list_id", listId);
  if (error) throw new Error("Não foi possível remover a obra.");
  revalidatePath(`/listas/${listId}`);
}

export async function saveSearch(parameters: Record<string, string | undefined>, path: string, formData: FormData) {
  const user = await requireAuthenticatedUser();
  const name = nameSchema.parse(formData.get("name"));
  const safe: Record<string, string> = { path: path === "/busca-avancada" ? path : "/buscar" };
  for (const key of savedSearchKeys) if (typeof parameters[key] === "string" && parameters[key]!.length <= 100) safe[key] = parameters[key]!;
  const supabase = await createClient();
  const { error } = await supabase.from("saved_searches").insert({ user_id: user.id, name, parameters_json: safe });
  if (error) throw new Error("Não foi possível salvar a pesquisa.");
  revalidatePath("/buscas-salvas");
  redirect("/buscas-salvas");
}

export async function deleteSearch(id: string) {
  uuid.parse(id);
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();
  const { error } = await supabase.from("saved_searches").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error("Não foi possível excluir a pesquisa.");
  revalidatePath("/buscas-salvas");
}
