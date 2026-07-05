import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { composerReliabilityLevels } from "@/lib/validators/composer";

export type ComposerFormData = {
  canonical_name?: string | null;
  display_name?: string | null;
  surname?: string | null;
  alternative_names?: string[] | null;
  pseudonyms?: string[] | null;
  birth_date?: string | null;
  death_date?: string | null;
  birth_year?: number | null;
  death_year?: number | null;
  birth_city?: string | null;
  birth_state?: string | null;
  birth_country?: string | null;
  death_city?: string | null;
  death_state?: string | null;
  nationality?: string | null;
  gender?: string | null;
  ethnicity_identity?: string | null;
  brazil_region?: string | null;
  short_biography?: string | null;
  long_biography?: string | null;
  biography_source?: string | null;
  official_website?: string | null;
  notes?: string | null;
  reliability_level?: string | null;
  slug?: string | null;
};

type ComposerFormProps = {
  action: (formData: FormData) => Promise<void>;
  composer?: ComposerFormData;
  submitLabel: string;
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

export function ComposerForm({ action, composer, submitLabel }: ComposerFormProps) {
  return (
    <form action={action} className="grid gap-6">
      <Card className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold">Identificacao</h2>
          {composer?.slug ? (
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">Slug atual: {composer.slug}</p>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Nome canonico
            <Input
              defaultValue={composer?.canonical_name ?? ""}
              name="canonical_name"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Nome de exibicao
            <Input defaultValue={composer?.display_name ?? ""} name="display_name" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Sobrenome
            <Input defaultValue={composer?.surname ?? ""} name="surname" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Nacionalidade
            <Input defaultValue={composer?.nationality ?? ""} name="nationality" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Nomes alternativos
          <Input
            defaultValue={listToInput(composer?.alternative_names)}
            name="alternative_names"
            placeholder="Separar por virgulas"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Pseudonimos
          <Input
            defaultValue={listToInput(composer?.pseudonyms)}
            name="pseudonyms"
            placeholder="Separar por virgulas"
          />
        </label>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Datas e origem</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-2 text-sm font-medium">
            Data nascimento
            <Input defaultValue={composer?.birth_date ?? ""} name="birth_date" type="date" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Ano nascimento
            <Input defaultValue={composer?.birth_year ?? ""} name="birth_year" type="number" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Data morte
            <Input defaultValue={composer?.death_date ?? ""} name="death_date" type="date" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Ano morte
            <Input defaultValue={composer?.death_year ?? ""} name="death_year" type="number" />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            Cidade nascimento
            <Input defaultValue={composer?.birth_city ?? ""} name="birth_city" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Estado nascimento
            <Input defaultValue={composer?.birth_state ?? ""} name="birth_state" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Pais nascimento
            <Input defaultValue={composer?.birth_country ?? ""} name="birth_country" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Cidade morte
            <Input defaultValue={composer?.death_city ?? ""} name="death_city" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Estado morte
            <Input defaultValue={composer?.death_state ?? ""} name="death_state" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Regiao Brasil
            <Input defaultValue={composer?.brazil_region ?? ""} name="brazil_region" />
          </label>
        </div>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-semibold">Dados curatoriais</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            Genero
            <Input defaultValue={composer?.gender ?? ""} name="gender" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Identidade/etnia
            <Input defaultValue={composer?.ethnicity_identity ?? ""} name="ethnicity_identity" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Confiabilidade
            <select
              className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
              defaultValue={composer?.reliability_level ?? "pending"}
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
        <h2 className="text-lg font-semibold">Biografia e fontes</h2>
        <label className="grid gap-2 text-sm font-medium">
          Biografia curta
          <textarea
            className="min-h-24 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            defaultValue={composer?.short_biography ?? ""}
            name="short_biography"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Biografia longa
          <textarea
            className="min-h-40 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            defaultValue={composer?.long_biography ?? ""}
            name="long_biography"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Fonte biografica
            <Input defaultValue={composer?.biography_source ?? ""} name="biography_source" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Website oficial
            <Input defaultValue={composer?.official_website ?? ""} name="official_website" type="url" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Observacoes
          <textarea
            className="min-h-24 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            defaultValue={composer?.notes ?? ""}
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
