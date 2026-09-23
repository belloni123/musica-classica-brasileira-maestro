import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChoirVoiceFields } from "@/components/forms/choir-voice-fields";
import { orchestraTypes } from "@/lib/catalog/options";

export type ComposerOption = { id: string; display_name: string };

export type WorkFormData = {
  composer_id?: string | null;
  canonical_title?: string | null;
  display_title?: string | null;
  composition_year_start?: number | null;
  composition_year_end?: number | null;
  duration_minutes?: number | null;
  formation_type?: string | null;
  soloist_type?: string | null;
  has_soloist?: boolean | null;
  has_choir?: boolean | null;
  main_source?: string | null;
  slug?: string | null;
};

export function WorkForm({ action, composers, submitLabel, work, choirVoices = [] }: {
  action: (formData: FormData) => Promise<void>;
  composers: ComposerOption[];
  submitLabel: string;
  work?: WorkFormData;
  choirVoices?: string[];
}) {
  const selectedSoloist = work?.soloist_type ?? (work?.has_soloist ? "" : "none");

  return <form action={action} className="grid gap-6">
    <Card className="grid gap-4">
      <h2 className="text-lg font-semibold">Identificação</h2>
      <label className="grid gap-2 text-sm font-medium">
        Compositor
        <select className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
          defaultValue={work?.composer_id ?? ""} name="composer_id" required>
          <option value="">Selecionar compositor</option>
          {composers.map(composer => <option key={composer.id} value={composer.id}>{composer.display_name}</option>)}
        </select>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Título canônico
          <Input defaultValue={work?.canonical_title ?? ""} name="canonical_title" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Título de exibição
          <Input defaultValue={work?.display_title ?? ""} name="display_title" required />
        </label>
      </div>
    </Card>

    <Card className="grid gap-4">
      <h2 className="text-lg font-semibold">Dados musicais</h2>
      <label className="grid gap-2 text-sm font-medium">
        Ano de composição
        <Input defaultValue={work?.composition_year_start ?? work?.composition_year_end ?? ""}
          min={0} max={3000} name="composition_year_start" type="number" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Duração
        <span className="flex items-center gap-2">
          <Input defaultValue={work?.duration_minutes ?? ""} min={0} name="duration_minutes" step="0.01" type="number" />
          <span>min</span>
        </span>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Meio de execução
        <select className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
          defaultValue={orchestraTypes.some(type => type === work?.formation_type) ? work?.formation_type ?? "" : ""} name="formation_type">
          <option value="">Selecionar</option>
          {orchestraTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Solista(s)
        <select className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
          defaultValue={selectedSoloist} name="soloist_type" required>
          {selectedSoloist === "" && <option value="">Selecionar</option>}
          <option value="none">Nenhum</option>
          <option value="vocal">Vocal</option>
          <option value="instrumental">Instrumental</option>
        </select>
      </label>
      <ChoirVoiceFields hasChoir={work?.has_choir} selectedVoices={choirVoices} />
    </Card>

    <Card className="grid gap-4">
      <h2 className="text-lg font-semibold">Disponibilidade de material</h2>
      <label className="grid gap-2 text-sm font-medium">
        Endereço do material
        <Input defaultValue={work?.main_source ?? ""} name="main_source" placeholder="https://..." type="url" />
      </label>
    </Card>

    <div className="flex justify-end"><Button type="submit">{submitLabel}</Button></div>
  </form>;
}
