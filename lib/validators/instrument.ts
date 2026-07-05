import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const optionalNumber = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? Number(value) : 0))
  .pipe(z.number().int().min(0).max(100000));

const commaSeparatedList = z
  .string()
  .trim()
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

export const instrumentFormSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do instrumento."),
  plural_name: optionalText,
  abbreviation: optionalText,
  family: z.string().trim().min(2, "Informe a familia instrumental."),
  family_id: optionalText,
  subfamily: optionalText,
  alternative_names: commaSeparatedList,
  is_brazilian_instrument: z.boolean(),
  active: z.boolean(),
  display_order: optionalNumber,
  notes: optionalText,
});

export type InstrumentFormValues = z.infer<typeof instrumentFormSchema>;

export function parseInstrumentFormData(formData: FormData) {
  return instrumentFormSchema.parse({
    name: formData.get("name") ?? "",
    plural_name: formData.get("plural_name") ?? "",
    abbreviation: formData.get("abbreviation") ?? "",
    family: formData.get("family") ?? "",
    family_id: formData.get("family_id") ?? "",
    subfamily: formData.get("subfamily") ?? "",
    alternative_names: formData.get("alternative_names") ?? "",
    is_brazilian_instrument: formData.get("is_brazilian_instrument") === "on",
    active: formData.getAll("active").includes("on"),
    display_order: formData.get("display_order") ?? "0",
    notes: formData.get("notes") ?? "",
  });
}
