import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { taxonomyTypes } from "@/lib/validators/taxonomy";

export type TaxonomyFormData = {
  name?: string | null;
  type?: string | null;
  slug?: string | null;
  description?: string | null;
};

export const taxonomyTypeLabels: Record<(typeof taxonomyTypes)[number], string> = {
  period: "Período",
  aesthetic_movement: "Movimento estético",
  theme: "Tema",
  region: "Região",
  formation: "Formação",
  programming_occasion: "Ocasião de programação",
  difficulty: "Dificuldade",
  pedagogical_profile: "Perfil pedagógico",
  brazilian_instrument: "Instrumento brasileiro",
  curatorial_identity: "Identidade curatorial",
};

export function TaxonomyForm({
  action,
  submitLabel,
  taxonomy,
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  taxonomy?: TaxonomyFormData;
}) {
  return (
    <form action={action} className="grid gap-6">
      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Taxonomia</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Nome
            <Input defaultValue={taxonomy?.name ?? ""} name="name" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Tipo
            <select
              className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
              defaultValue={taxonomy?.type ?? "theme"}
              name="type"
            >
              {taxonomyTypes.map((type) => (
                <option key={type} value={type}>
                  {taxonomyTypeLabels[type]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Slug
          <Input
            defaultValue={taxonomy?.slug ?? ""}
            name="slug"
            placeholder="Gerado automaticamente se ficar vazio"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Descrição
          <textarea
            className="min-h-32 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            defaultValue={taxonomy?.description ?? ""}
            name="description"
          />
        </label>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
