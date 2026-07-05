import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const optionalEmail = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .pipe(z.string().email().nullable());

const optionalUrl = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .pipe(z.string().url().nullable());

export const sourceHolderTypes = [
  "publisher",
  "archive",
  "library",
  "composer_estate",
  "institution",
  "website",
  "person",
  "other",
] as const;

export const sourceHolderFormSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome."),
  type: z.enum(sourceHolderTypes),
  country: optionalText,
  state: optionalText,
  city: optionalText,
  address: optionalText,
  email: optionalEmail,
  phone: optionalText,
  website: optionalUrl,
  contact_person: optionalText,
  notes: optionalText,
  active: z.boolean(),
});

export type SourceHolderFormValues = z.infer<typeof sourceHolderFormSchema>;

export function parseSourceHolderFormData(formData: FormData) {
  return sourceHolderFormSchema.parse({
    name: formData.get("name") ?? "",
    type: formData.get("type") ?? "other",
    country: formData.get("country") ?? "",
    state: formData.get("state") ?? "",
    city: formData.get("city") ?? "",
    address: formData.get("address") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    website: formData.get("website") ?? "",
    contact_person: formData.get("contact_person") ?? "",
    notes: formData.get("notes") ?? "",
    active: formData.getAll("active").includes("on"),
  });
}
