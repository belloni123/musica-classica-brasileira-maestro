import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const optionalUrl = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .pipe(z.string().url().nullable());

const optionalDate = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable());

const optionalYear = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? Number(value) : null))
  .pipe(z.number().int().min(0).max(3000).nullable());

const commaSeparatedList = z
  .string()
  .trim()
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

export const composerReliabilityLevels = [
  "primary_source_confirmed",
  "secondary_source_confirmed",
  "composer_reported",
  "publisher_reported",
  "inferred",
  "pending",
] as const;

export const composerFormSchema = z.object({
  canonical_name: z.string().trim().min(2, "Informe o nome canonico."),
  display_name: z.string().trim().min(2, "Informe o nome de exibicao."),
  surname: optionalText,
  alternative_names: commaSeparatedList,
  pseudonyms: commaSeparatedList,
  birth_date: optionalDate,
  death_date: optionalDate,
  birth_year: optionalYear,
  death_year: optionalYear,
  birth_city: optionalText,
  birth_state: optionalText,
  birth_country: optionalText,
  death_city: optionalText,
  death_state: optionalText,
  nationality: optionalText,
  gender: optionalText,
  ethnicity_identity: optionalText,
  brazil_region: optionalText,
  short_biography: optionalText,
  long_biography: optionalText,
  biography_source: optionalText,
  official_website: optionalUrl,
  notes: optionalText,
  reliability_level: z.enum(composerReliabilityLevels),
});

export type ComposerFormValues = z.infer<typeof composerFormSchema>;

export function parseComposerFormData(formData: FormData) {
  return composerFormSchema.parse({
    canonical_name: formData.get("canonical_name") ?? "",
    display_name: formData.get("display_name") ?? "",
    surname: formData.get("surname") ?? "",
    alternative_names: formData.get("alternative_names") ?? "",
    pseudonyms: formData.get("pseudonyms") ?? "",
    birth_date: formData.get("birth_date") ?? "",
    death_date: formData.get("death_date") ?? "",
    birth_year: formData.get("birth_year") ?? "",
    death_year: formData.get("death_year") ?? "",
    birth_city: formData.get("birth_city") ?? "",
    birth_state: formData.get("birth_state") ?? "",
    birth_country: formData.get("birth_country") ?? "",
    death_city: formData.get("death_city") ?? "",
    death_state: formData.get("death_state") ?? "",
    nationality: formData.get("nationality") ?? "",
    gender: formData.get("gender") ?? "",
    ethnicity_identity: formData.get("ethnicity_identity") ?? "",
    brazil_region: formData.get("brazil_region") ?? "",
    short_biography: formData.get("short_biography") ?? "",
    long_biography: formData.get("long_biography") ?? "",
    biography_source: formData.get("biography_source") ?? "",
    official_website: formData.get("official_website") ?? "",
    notes: formData.get("notes") ?? "",
    reliability_level: formData.get("reliability_level") ?? "pending",
  });
}
