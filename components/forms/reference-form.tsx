import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { referenceTypes } from "@/lib/validators/reference";

export type ReferenceFormData = {
  type?: string | null;
  author?: string | null;
  title?: string | null;
  year?: number | null;
  publisher?: string | null;
  institution?: string | null;
  place?: string | null;
  doi?: string | null;
  url?: string | null;
  accessed_at?: string | null;
  notes?: string | null;
};

const typeLabels: Record<(typeof referenceTypes)[number], string> = {
  book: "Livro",
  article: "Artigo",
  thesis: "Tese",
  dissertation: "Dissertação",
  catalog: "Catálogo",
  website: "Website",
  program_note: "Nota de programa",
  archive_record: "Registro de acervo",
  other: "Outro",
};

export function ReferenceForm({
  action,
  reference,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  reference?: ReferenceFormData;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-6">
      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Referência</h2>
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <label className="grid gap-2 text-sm font-medium">
            Tipo
            <select
              className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
              defaultValue={reference?.type ?? "other"}
              name="type"
            >
              {referenceTypes.map((type) => (
                <option key={type} value={type}>
                  {typeLabels[type]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Título
            <Input defaultValue={reference?.title ?? ""} name="title" required />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Autor(es)
          <Input defaultValue={reference?.author ?? ""} name="author" />
        </label>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Publicação</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            Ano
            <Input defaultValue={reference?.year ?? ""} name="year" type="number" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Editora/publicação
            <Input defaultValue={reference?.publisher ?? ""} name="publisher" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Instituição
            <Input defaultValue={reference?.institution ?? ""} name="institution" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Local
          <Input defaultValue={reference?.place ?? ""} name="place" />
        </label>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Identificadores e acesso</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            DOI
            <Input defaultValue={reference?.doi ?? ""} name="doi" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            URL
            <Input defaultValue={reference?.url ?? ""} name="url" type="url" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Data de acesso
            <Input defaultValue={reference?.accessed_at ?? ""} name="accessed_at" type="date" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Observações
          <textarea
            className="min-h-32 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            defaultValue={reference?.notes ?? ""}
            name="notes"
          />
        </label>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
