import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sourceHolderTypes } from "@/lib/validators/source-holder";

export type SourceHolderFormData = {
  name?: string | null;
  type?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  contact_person?: string | null;
  notes?: string | null;
  active?: boolean | null;
};

const typeLabels: Record<(typeof sourceHolderTypes)[number], string> = {
  publisher: "Editora",
  archive: "Acervo",
  library: "Biblioteca",
  composer_estate: "Espólio",
  institution: "Instituição",
  website: "Website",
  person: "Pessoa",
  other: "Outro",
};

export function SourceHolderForm({
  action,
  source,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  source?: SourceHolderFormData;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-6">
      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Identificação</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Nome
            <Input defaultValue={source?.name ?? ""} name="name" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Tipo
            <select
              className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
              defaultValue={source?.type ?? "other"}
              name="type"
            >
              {sourceHolderTypes.map((type) => (
                <option key={type} value={type}>
                  {typeLabels[type]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input name="active" type="hidden" value="off" />
          <input defaultChecked={source?.active ?? true} name="active" type="checkbox" value="on" />
          Ativo
        </label>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Localização e contato</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            País
            <Input defaultValue={source?.country ?? ""} name="country" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Estado
            <Input defaultValue={source?.state ?? ""} name="state" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Cidade
            <Input defaultValue={source?.city ?? ""} name="city" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Endereço
          <Input defaultValue={source?.address ?? ""} name="address" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            E-mail
            <Input defaultValue={source?.email ?? ""} name="email" type="email" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Telefone
            <Input defaultValue={source?.phone ?? ""} name="phone" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Website
            <Input defaultValue={source?.website ?? ""} name="website" type="url" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Pessoa de contato
            <Input defaultValue={source?.contact_person ?? ""} name="contact_person" />
          </label>
        </div>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Observações</h2>
        <textarea
          className="min-h-32 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
          defaultValue={source?.notes ?? ""}
          name="notes"
        />
      </Card>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
