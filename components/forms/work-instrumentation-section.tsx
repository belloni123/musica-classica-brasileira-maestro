import { Trash2 } from "lucide-react";
import {
  addWorkInstrumentation,
  removeWorkInstrumentation,
} from "@/app/admin/obras/instrumentation-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type InstrumentOption = {
  id: string;
  name: string;
  family: string;
};

export type WorkInstrumentationRow = {
  id: string;
  instrument_id: string;
  minimum_quantity: number | null;
  maximum_quantity: number | null;
  quantity_text: string | null;
  required: boolean;
  optional: boolean;
  doubling: boolean;
  doubled_instrument_id: string | null;
  substitutable: boolean;
  notes: string | null;
  source: string | null;
};

function instrumentName(instruments: InstrumentOption[], id?: string | null) {
  return instruments.find((instrument) => instrument.id === id)?.name ?? "Instrumento não encontrado";
}

function quantityLabel(row: WorkInstrumentationRow) {
  if (row.quantity_text) return row.quantity_text;
  if (row.minimum_quantity !== null && row.maximum_quantity !== null) {
    return row.minimum_quantity === row.maximum_quantity
      ? String(row.minimum_quantity)
      : `${row.minimum_quantity}-${row.maximum_quantity}`;
  }
  if (row.minimum_quantity !== null) return `mín. ${row.minimum_quantity}`;
  if (row.maximum_quantity !== null) return `máx. ${row.maximum_quantity}`;
  return "-";
}

export function WorkInstrumentationSection({
  instruments,
  rows,
  workId,
}: {
  instruments: InstrumentOption[];
  rows: WorkInstrumentationRow[];
  workId: string;
}) {
  const addAction = addWorkInstrumentation.bind(null, workId);

  return (
    <Card className="grid gap-5">
      <div>
        <h2 className="text-lg font-semibold">Instrumentação estruturada</h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Registre instrumentos, quantidades, dobramentos e observações de execução.
        </p>
      </div>

      {rows.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-[var(--border)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--muted)] text-xs uppercase text-[var(--muted-foreground)]">
              <tr>
                <th className="px-3 py-2">Instrumento</th>
                <th className="px-3 py-2">Qtd.</th>
                <th className="px-3 py-2">Atributos</th>
                <th className="px-3 py-2">Observação</th>
                <th className="px-3 py-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const removeAction = removeWorkInstrumentation.bind(null, workId, row.id);
                return (
                  <tr className="border-t border-[var(--border)]" key={row.id}>
                    <td className="px-3 py-2">
                      <div className="font-medium">{instrumentName(instruments, row.instrument_id)}</div>
                      {row.doubled_instrument_id ? (
                        <div className="text-xs text-[var(--muted-foreground)]">
                          dobra {instrumentName(instruments, row.doubled_instrument_id)}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">{quantityLabel(row)}</td>
                    <td className="px-3 py-2 text-[var(--muted-foreground)]">
                      {[
                        row.required ? "obrigatório" : null,
                        row.optional ? "opcional" : null,
                        row.doubling ? "dobramento" : null,
                        row.substitutable ? "substituível" : null,
                      ]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </td>
                    <td className="px-3 py-2 text-[var(--muted-foreground)]">{row.notes ?? "-"}</td>
                    <td className="px-3 py-2">
                      <form action={removeAction}>
                        <Button size="sm" type="submit" variant="ghost">
                          <Trash2 size={14} aria-hidden="true" />
                          Remover
                        </Button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)]">
          Nenhum instrumento estruturado cadastrado para esta obra.
        </p>
      )}

      <form action={addAction} className="grid gap-4 border-t border-[var(--border)] pt-5">
        <h3 className="font-semibold">Adicionar instrumento</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Instrumento
            <select
              className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
              name="instrument_id"
              required
            >
              <option value="">Selecionar instrumento</option>
              {instruments.map((instrument) => (
                <option key={instrument.id} value={instrument.id}>
                  {instrument.name} · {instrument.family}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Instrumento dobrado
            <select
              className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
              name="doubled_instrument_id"
            >
              <option value="">Nenhum</option>
              {instruments.map((instrument) => (
                <option key={instrument.id} value={instrument.id}>
                  {instrument.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            Qtd. mínima
            <Input min={0} name="minimum_quantity" type="number" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Qtd. máxima
            <Input min={0} name="maximum_quantity" type="number" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Qtd. textual
            <Input name="quantity_text" placeholder="Ex.: 2 ou 2-3" />
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input defaultChecked name="required" type="checkbox" />
            Obrigatório
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input name="optional" type="checkbox" />
            Opcional
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input name="doubling" type="checkbox" />
            Dobramento
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input name="substitutable" type="checkbox" />
            Substituível
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Fonte
            <Input name="source" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Observação
            <Input name="notes" />
          </label>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Adicionar instrumento</Button>
        </div>
      </form>
    </Card>
  );
}
