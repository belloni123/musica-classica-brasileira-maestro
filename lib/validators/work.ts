import { z } from "zod";
import { composerReliabilityLevels } from "@/lib/validators/composer";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const optionalYear = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? Number(value) : null))
  .pipe(z.number().int().min(0).max(3000).nullable());

const optionalInteger = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? Number(value) : null))
  .pipe(z.number().int().min(0).max(100000).nullable());

const optionalDecimal = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? Number(value) : null))
  .pipe(z.number().min(0).max(100000).nullable());

const commaSeparatedList = z
  .string()
  .trim()
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

export const workFormSchema = z.object({
  composer_id: z.string().uuid("Selecione um compositor."),
  canonical_title: z.string().trim().min(1, "Informe o titulo canonico."),
  display_title: z.string().trim().min(1, "Informe o titulo de exibicao."),
  alternative_titles: commaSeparatedList,
  original_title: optionalText,
  translated_title: optionalText,
  composition_year_start: optionalYear,
  composition_year_end: optionalYear,
  composition_date_text: optionalText,
  revision_year: optionalYear,
  opus: optionalText,
  catalog: optionalText,
  catalog_number: optionalText,
  duration_minutes: optionalDecimal,
  duration_minimum: optionalInteger,
  duration_maximum: optionalInteger,
  formation_type: optionalText,
  difficulty_level: optionalText,
  has_choir: z.boolean(),
  has_soloist: z.boolean(),
  has_electronics: z.boolean(),
  has_brazilian_instruments: z.boolean(),
  educational_work: z.boolean(),
  youth_work: z.boolean(),
  public_domain: z.boolean(),
  rights_status: optionalText,
  work_status: optionalText,
  public_summary: optionalText,
  subscriber_notes: optionalText,
  performance_notes: optionalText,
  editorial_notes: optionalText,
  main_source: optionalText,
  instrumentation_text: optionalText,
  reliability_level: z.enum(composerReliabilityLevels),
});

export type WorkFormValues = z.infer<typeof workFormSchema>;

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export function parseWorkFormData(formData: FormData) {
  return workFormSchema.parse({
    composer_id: formData.get("composer_id") ?? "",
    canonical_title: formData.get("canonical_title") ?? "",
    display_title: formData.get("display_title") ?? "",
    alternative_titles: formData.get("alternative_titles") ?? "",
    original_title: formData.get("original_title") ?? "",
    translated_title: formData.get("translated_title") ?? "",
    composition_year_start: formData.get("composition_year_start") ?? "",
    composition_year_end: formData.get("composition_year_end") ?? "",
    composition_date_text: formData.get("composition_date_text") ?? "",
    revision_year: formData.get("revision_year") ?? "",
    opus: formData.get("opus") ?? "",
    catalog: formData.get("catalog") ?? "",
    catalog_number: formData.get("catalog_number") ?? "",
    duration_minutes: formData.get("duration_minutes") ?? "",
    duration_minimum: formData.get("duration_minimum") ?? "",
    duration_maximum: formData.get("duration_maximum") ?? "",
    formation_type: formData.get("formation_type") ?? "",
    difficulty_level: formData.get("difficulty_level") ?? "",
    has_choir: checkbox(formData, "has_choir"),
    has_soloist: checkbox(formData, "has_soloist"),
    has_electronics: checkbox(formData, "has_electronics"),
    has_brazilian_instruments: checkbox(formData, "has_brazilian_instruments"),
    educational_work: checkbox(formData, "educational_work"),
    youth_work: checkbox(formData, "youth_work"),
    public_domain: checkbox(formData, "public_domain"),
    rights_status: formData.get("rights_status") ?? "",
    work_status: formData.get("work_status") ?? "",
    public_summary: formData.get("public_summary") ?? "",
    subscriber_notes: formData.get("subscriber_notes") ?? "",
    performance_notes: formData.get("performance_notes") ?? "",
    editorial_notes: formData.get("editorial_notes") ?? "",
    main_source: formData.get("main_source") ?? "",
    instrumentation_text: formData.get("instrumentation_text") ?? "",
    reliability_level: formData.get("reliability_level") ?? "pending",
  });
}
