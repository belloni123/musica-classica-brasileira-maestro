import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { composerReliabilityLevels } from "@/lib/validators/composer";

export type ComposerOption = {
  id: string;
  display_name: string;
};

export type WorkFormData = {
  composer_id?: string | null;
  canonical_title?: string | null;
  display_title?: string | null;
  alternative_titles?: string[] | null;
  original_title?: string | null;
  translated_title?: string | null;
  composition_year_start?: number | null;
  composition_year_end?: number | null;
  composition_date_text?: string | null;
  revision_year?: number | null;
  opus?: string | null;
  catalog?: string | null;
  catalog_number?: string | null;
  duration_minutes?: number | null;
  duration_minimum?: number | null;
  duration_maximum?: number | null;
  formation_type?: string | null;
  difficulty_level?: string | null;
  has_choir?: boolean | null;
  has_soloist?: boolean | null;
  has_electronics?: boolean | null;
  has_brazilian_instruments?: boolean | null;
  educational_work?: boolean | null;
  youth_work?: boolean | null;
  public_domain?: boolean | null;
  rights_status?: string | null;
  work_status?: string | null;
  public_summary?: string | null;
  subscriber_notes?: string | null;
  performance_notes?: string | null;
  editorial_notes?: string | null;
  main_source?: string | null;
  instrumentation_text?: string | null;
  reliability_level?: string | null;
  slug?: string | null;
};

const reliabilityLabels: Record<(typeof composerReliabilityLevels)[number], string> = {
  primary_source_confirmed: "Confirmado por fonte primaria",
  secondary_source_confirmed: "Confirmado por fonte secundaria",
  composer_reported: "Informado pelo compositor",
  publisher_reported: "Informado por editora",
  inferred: "Inferido",
  pending: "Pendente",
};

function listToInput(value?: string[] | null) {
  return value?.join(", ") ?? "";
}

function BooleanField({
  defaultChecked,
  label,
  name,
}: {
  defaultChecked?: boolean | null;
  label: string;
  name: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <input defaultChecked={defaultChecked ?? false} name={name} type="checkbox" />
      {label}
    </label>
  );
}

export function WorkForm({
  action,
  composers,
  submitLabel,
  work,
}: {
  action: (formData: FormData) => Promise<void>;
  composers: ComposerOption[];
  submitLabel: string;
  work?: WorkFormData;
}) {
  return (
    <form action={action} className="grid gap-6">
      <Card className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold">Identificação</h2>
          {work?.slug ? (
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">Slug atual: {work.slug}</p>
          ) : null}
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Compositor
          <select
            className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
            defaultValue={work?.composer_id ?? ""}
            name="composer_id"
            required
          >
            <option value="">Selecionar compositor</option>
            {composers.map((composer) => (
              <option key={composer.id} value={composer.id}>
                {composer.display_name}
              </option>
            ))}
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
        <label className="grid gap-2 text-sm font-medium">
          Títulos alternativos
          <Input
            defaultValue={listToInput(work?.alternative_titles)}
            name="alternative_titles"
            placeholder="Separar por virgulas"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Título original
            <Input defaultValue={work?.original_title ?? ""} name="original_title" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Título traduzido
            <Input defaultValue={work?.translated_title ?? ""} name="translated_title" />
          </label>
        </div>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Dados musicais</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-2 text-sm font-medium">
            Ano inicial
            <Input defaultValue={work?.composition_year_start ?? ""} name="composition_year_start" type="number" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Ano final
            <Input defaultValue={work?.composition_year_end ?? ""} name="composition_year_end" type="number" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Ano revisão
            <Input defaultValue={work?.revision_year ?? ""} name="revision_year" type="number" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Data textual
            <Input defaultValue={work?.composition_date_text ?? ""} name="composition_date_text" />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            Opus
            <Input defaultValue={work?.opus ?? ""} name="opus" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Catálogo
            <Input defaultValue={work?.catalog ?? ""} name="catalog" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Número catálogo
            <Input defaultValue={work?.catalog_number ?? ""} name="catalog_number" />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            Duração
            <Input defaultValue={work?.duration_minutes ?? ""} name="duration_minutes" step="0.01" type="number" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Duração mínima
            <Input defaultValue={work?.duration_minimum ?? ""} name="duration_minimum" type="number" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Duração máxima
            <Input defaultValue={work?.duration_maximum ?? ""} name="duration_maximum" type="number" />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            Formação
            <Input defaultValue={work?.formation_type ?? ""} name="formation_type" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Dificuldade
            <Input defaultValue={work?.difficulty_level ?? ""} name="difficulty_level" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Confiabilidade
            <select
              className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
              defaultValue={work?.reliability_level ?? "pending"}
              name="reliability_level"
            >
              {composerReliabilityLevels.map((level) => (
                <option key={level} value={level}>
                  {reliabilityLabels[level]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Atributos práticos</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <BooleanField defaultChecked={work?.has_choir} label="Possui coro" name="has_choir" />
          <BooleanField defaultChecked={work?.has_soloist} label="Possui solista" name="has_soloist" />
          <BooleanField defaultChecked={work?.has_electronics} label="Possui eletrônica" name="has_electronics" />
          <BooleanField
            defaultChecked={work?.has_brazilian_instruments}
            label="Instrumentos brasileiros"
            name="has_brazilian_instruments"
          />
          <BooleanField defaultChecked={work?.educational_work} label="Educacional" name="educational_work" />
          <BooleanField defaultChecked={work?.youth_work} label="Juvenil" name="youth_work" />
          <BooleanField defaultChecked={work?.public_domain} label="Domínio público" name="public_domain" />
        </div>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Direitos e fontes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Status de direitos
            <Input defaultValue={work?.rights_status ?? ""} name="rights_status" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Status da obra
            <Input defaultValue={work?.work_status ?? ""} name="work_status" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Fonte principal
          <Input defaultValue={work?.main_source ?? ""} name="main_source" />
        </label>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Textos e notas</h2>
        <label className="grid gap-2 text-sm font-medium">
          Instrumentação textual
          <textarea
            className="min-h-24 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            defaultValue={work?.instrumentation_text ?? ""}
            name="instrumentation_text"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Resumo público
          <textarea
            className="min-h-24 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            defaultValue={work?.public_summary ?? ""}
            name="public_summary"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Notas para assinantes
          <textarea
            className="min-h-24 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            defaultValue={work?.subscriber_notes ?? ""}
            name="subscriber_notes"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Notas de performance
          <textarea
            className="min-h-24 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            defaultValue={work?.performance_notes ?? ""}
            name="performance_notes"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Notas editoriais
          <textarea
            className="min-h-24 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            defaultValue={work?.editorial_notes ?? ""}
            name="editorial_notes"
          />
        </label>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
