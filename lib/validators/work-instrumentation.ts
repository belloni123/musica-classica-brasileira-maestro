import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const optionalUuid = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .pipe(z.string().uuid().nullable());

const optionalQuantity = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? Number(value) : null))
  .pipe(z.number().int().min(0).max(1000).nullable());

export const workInstrumentationFormSchema = z
  .object({
    instrument_id: z.string().uuid("Selecione um instrumento."),
    minimum_quantity: optionalQuantity,
    maximum_quantity: optionalQuantity,
    quantity_text: optionalText,
    role: optionalText,
    required: z.boolean(),
    optional: z.boolean(),
    doubling: z.boolean(),
    doubled_instrument_id: optionalUuid,
    substitutable: z.boolean(),
    notes: optionalText,
    source: optionalText,
  })
  .refine(
    (value) =>
      value.minimum_quantity === null ||
      value.maximum_quantity === null ||
      value.minimum_quantity <= value.maximum_quantity,
    {
      message: "Quantidade minima nao pode ser maior que a maxima.",
      path: ["maximum_quantity"],
    },
  );

export type WorkInstrumentationFormValues = z.infer<typeof workInstrumentationFormSchema>;

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export function parseWorkInstrumentationFormData(formData: FormData) {
  return workInstrumentationFormSchema.parse({
    instrument_id: formData.get("instrument_id") ?? "",
    minimum_quantity: formData.get("minimum_quantity") ?? "",
    maximum_quantity: formData.get("maximum_quantity") ?? "",
    quantity_text: formData.get("quantity_text") ?? "",
    role: formData.get("role") ?? "",
    required: checkbox(formData, "required"),
    optional: checkbox(formData, "optional"),
    doubling: checkbox(formData, "doubling"),
    doubled_instrument_id: formData.get("doubled_instrument_id") ?? "",
    substitutable: checkbox(formData, "substitutable"),
    notes: formData.get("notes") ?? "",
    source: formData.get("source") ?? "",
  });
}

export function parseWorkInstrumentationBatchFormData(formData: FormData) {
  const rawCount = formData.get("item_count");
  const count = typeof rawCount === "string" && /^\d+$/.test(rawCount) ? Number(rawCount) : 0;
  if (count < 1 || count > 40) {
    throw new Error("Adicione entre 1 e 40 instrumentos por vez.");
  }

  return Array.from({ length: count }, (_, index) => {
    const exact = formData.get(`exact_quantity_${index}`)?.toString().trim() ?? "";
    const minimum = formData.get(`minimum_quantity_${index}`)?.toString().trim() ?? "";
    const maximum = formData.get(`maximum_quantity_${index}`)?.toString().trim() ?? "";
    if (exact && (minimum || maximum)) {
      throw new Error(`Instrumento ${index + 1}: use quantidade exata ou intervalo, não ambos.`);
    }

    const item = new FormData();
    for (const name of [
      "instrument_id", "quantity_text", "role", "required", "optional", "doubling",
      "doubled_instrument_id", "substitutable", "notes", "source",
    ]) {
      item.set(name, formData.get(`${name}_${index}`)?.toString() ?? "");
    }
    item.set("minimum_quantity", exact || minimum);
    item.set("maximum_quantity", exact || maximum);
    return parseWorkInstrumentationFormData(item);
  });
}
