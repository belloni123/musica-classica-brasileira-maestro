"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { addWorkInstrumentations } from "@/app/admin/obras/instrumentation-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { InstrumentOption } from "@/components/forms/work-instrumentation-section";

const selectClass = "h-10 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm";

export function WorkInstrumentationBatchForm({ instruments, workId }: {
  instruments: InstrumentOption[];
  workId: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const nextKey = useRef(1);
  const focusNewRow = useRef(false);
  const [rowKeys, setRowKeys] = useState([0]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!focusNewRow.current) return;
    formRef.current?.querySelector<HTMLSelectElement>(`[name="instrument_id_${rowKeys.length - 1}"]`)?.focus();
    focusNewRow.current = false;
  }, [rowKeys]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = event.currentTarget;
    const count = rowKeys.length;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await addWorkInstrumentations(workId, new FormData(form));
      form.reset();
      setRowKeys([nextKey.current++]);
      setMessage(`${count} ${count === 1 ? "instrumento adicionado" : "instrumentos adicionados"} com sucesso.`);
      router.refresh();
    } catch {
      setError("Não foi possível salvar os instrumentos. Confira os campos e tente novamente; nenhuma linha foi adicionada.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4 border-t border-[var(--border)] pt-5" onSubmit={handleSubmit} ref={formRef}>
      <div>
        <h3 className="font-semibold">Adicionar instrumentos</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Monte a lista inteira e salve uma única vez. Para uma quantidade exata, basta preencher o número.
        </p>
      </div>
      <input name="item_count" type="hidden" value={rowKeys.length} />
      {rowKeys.map((key, index) => (
        <fieldset className="min-w-0 rounded-md border border-[var(--border)] p-4" key={key}>
          <legend className="px-1 text-sm font-semibold">Instrumento {index + 1}</legend>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem_auto] sm:items-end">
            <label className="grid gap-2 text-sm font-medium">
              Instrumento
              <select className={selectClass} name={`instrument_id_${index}`} required defaultValue="">
                <option value="">Selecionar instrumento</option>
                {instruments.map((instrument) => (
                  <option key={instrument.id} value={instrument.id}>
                    {instrument.name} · {instrument.family}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Qtd. exata
              <Input max={1000} min={0} name={`exact_quantity_${index}`} type="number" />
            </label>
            <Button
              aria-label={`Remover instrumento ${index + 1}`}
              disabled={saving || rowKeys.length === 1}
              onClick={() => setRowKeys((current) => current.filter((item) => item !== key))}
              type="button"
              variant="ghost"
            >
              <Trash2 size={16} aria-hidden="true" /> Remover
            </Button>
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium">Intervalo, dobramento e outras opções</summary>
            <div className="mt-4 grid gap-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                Para informar um intervalo, deixe a quantidade exata vazia e preencha mínimo e máximo.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-2 text-sm font-medium">Qtd. mínima
                  <Input max={1000} min={0} name={`minimum_quantity_${index}`} type="number" />
                </label>
                <label className="grid gap-2 text-sm font-medium">Qtd. máxima
                  <Input max={1000} min={0} name={`maximum_quantity_${index}`} type="number" />
                </label>
                <label className="grid gap-2 text-sm font-medium">Qtd. textual
                  <Input name={`quantity_text_${index}`} placeholder="Ex.: 2 ou 2-3" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">Função
                  <select className={selectClass} name={`role_${index}`} defaultValue="">
                    <option value="">Conjunto</option><option value="solista">Solista</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium">Instrumento dobrado
                  <select className={selectClass} name={`doubled_instrument_id_${index}`} defaultValue="">
                    <option value="">Nenhum</option>
                    {instruments.map((instrument) => (
                      <option key={instrument.id} value={instrument.id}>{instrument.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                {(["required", "optional", "doubling", "substitutable"] as const).map((field) => (
                  <label className="flex items-center gap-2 text-sm font-medium" key={field}>
                    <input defaultChecked={field === "required"} name={`${field}_${index}`} type="checkbox" />
                    {{ required: "Obrigatório", optional: "Opcional", doubling: "Dobramento", substitutable: "Substituível" }[field]}
                  </label>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">Fonte
                  <Input name={`source_${index}`} />
                </label>
                <label className="grid gap-2 text-sm font-medium">Observação
                  <Input name={`notes_${index}`} />
                </label>
              </div>
            </div>
          </details>
        </fieldset>
      ))}
      {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
      {message ? <p className="text-sm text-green-800" role="status">{message}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          disabled={saving || rowKeys.length >= 40}
          onClick={() => {
            focusNewRow.current = true;
            setRowKeys((current) => [...current, nextKey.current++]);
          }}
          type="button"
          variant="secondary"
        >
          <Plus size={16} aria-hidden="true" /> Adicionar outro instrumento
        </Button>
        <Button disabled={saving} type="submit">
          {saving ? "Salvando..." : `Salvar ${rowKeys.length} ${rowKeys.length === 1 ? "instrumento" : "instrumentos"}`}
        </Button>
      </div>
    </form>
  );
}
