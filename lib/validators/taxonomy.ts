import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

export const taxonomyTypes = [
  "period",
  "aesthetic_movement",
  "theme",
  "region",
  "formation",
  "programming_occasion",
  "difficulty",
  "pedagogical_profile",
  "brazilian_instrument",
  "curatorial_identity",
] as const;

export const taxonomyFormSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome."),
  type: z.enum(taxonomyTypes),
  slug: optionalText,
  description: optionalText,
});

export type TaxonomyFormValues = z.infer<typeof taxonomyFormSchema>;

export function parseTaxonomyFormData(formData: FormData) {
  return taxonomyFormSchema.parse({
    name: formData.get("name") ?? "",
    type: formData.get("type") ?? "theme",
    slug: formData.get("slug") ?? "",
    description: formData.get("description") ?? "",
  });
}
