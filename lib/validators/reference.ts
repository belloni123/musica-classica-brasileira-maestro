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

export const referenceTypes = [
  "book",
  "article",
  "thesis",
  "dissertation",
  "catalog",
  "website",
  "program_note",
  "archive_record",
  "other",
] as const;

export const referenceFormSchema = z.object({
  type: z.enum(referenceTypes),
  author: optionalText,
  title: z.string().trim().min(2, "Informe o titulo."),
  year: optionalYear,
  publisher: optionalText,
  institution: optionalText,
  place: optionalText,
  doi: optionalText,
  url: optionalUrl,
  accessed_at: optionalDate,
  notes: optionalText,
});

export type ReferenceFormValues = z.infer<typeof referenceFormSchema>;

export function parseReferenceFormData(formData: FormData) {
  return referenceFormSchema.parse({
    type: formData.get("type") ?? "other",
    author: formData.get("author") ?? "",
    title: formData.get("title") ?? "",
    year: formData.get("year") ?? "",
    publisher: formData.get("publisher") ?? "",
    institution: formData.get("institution") ?? "",
    place: formData.get("place") ?? "",
    doi: formData.get("doi") ?? "",
    url: formData.get("url") ?? "",
    accessed_at: formData.get("accessed_at") ?? "",
    notes: formData.get("notes") ?? "",
  });
}
