import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type InstrumentFamilyOption = {
  id: string;
  name: string;
};

export type InstrumentFormData = {
  name?: string | null;
  plural_name?: string | null;
  abbreviation?: string | null;
  family?: string | null;
  family_id?: string | null;
  subfamily?: string | null;
  alternative_names?: string[] | null;
  is_brazilian_instrument?: boolean | null;
  active?: boolean | null;
  display_order?: number | null;
  notes?: string | null;
};

function listToInput(value?: string[] | null) {
  return value?.join(", ") ?? "";
}

export function InstrumentForm({
  action,
  families,
  instrument,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  families: InstrumentFamilyOption[];
  instrument?: InstrumentFormData;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-6">
      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Identificacao</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Nome
            <Input defaultValue={instrument?.name ?? ""} name="name" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Nome plural
            <Input defaultValue={instrument?.plural_name ?? ""} name="plural_name" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Abreviacao
            <Input defaultValue={instrument?.abbreviation ?? ""} name="abbreviation" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Ordem de exibicao
            <Input
              defaultValue={instrument?.display_order ?? 0}
              min={0}
              name="display_order"
              type="number"
            />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Nomes alternativos
          <Input
            defaultValue={listToInput(instrument?.alternative_names)}
            name="alternative_names"
            placeholder="Separar por virgulas"
          />
        </label>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Classificacao</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Familia instrumental
            <select
              className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
              defaultValue={instrument?.family_id ?? ""}
              name="family_id"
              required
            >
              <option value="">Selecionar familia</option>
              {families.map((family) => (
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Subfamilia
            <Input defaultValue={instrument?.subfamily ?? ""} name="subfamily" />
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              defaultChecked={instrument?.is_brazilian_instrument ?? false}
              name="is_brazilian_instrument"
              type="checkbox"
            />
            Instrumento brasileiro
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input name="active" type="hidden" value="off" />
            <input
              defaultChecked={instrument?.active ?? true}
              name="active"
              type="checkbox"
              value="on"
            />
            Ativo
          </label>
        </div>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Observacoes</h2>
        <textarea
          className="min-h-28 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
          defaultValue={instrument?.notes ?? ""}
          name="notes"
        />
      </Card>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
