import { Trash2 } from "lucide-react";
import { removeWorkInstrumentation } from "@/app/admin/obras/instrumentation-actions";
import { WorkInstrumentationBatchForm } from "@/components/forms/work-instrumentation-batch-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sortInstrumentationRows } from "@/lib/catalog/instrumentation";

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
  const orderedRows = sortInstrumentationRows(rows, row => instrumentName(instruments, row.instrument_id));

  return (
    <Card className="grid gap-5">
      <div>
        <h2 className="text-lg font-semibold">Instrumentação estruturada</h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Registre instrumentos, quantidades, dobramentos e observações de execução. O código numérico da ficha e a pesquisa por quantidades são gerados a partir destes dados, não do texto livre. Adicione todos os instrumentos necessários e salve-os de uma vez.
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
              {orderedRows.map((row) => {
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

      <WorkInstrumentationBatchForm instruments={instruments} workId={workId} />
    </Card>
  );
}
