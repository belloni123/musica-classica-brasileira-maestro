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
    required: checkbox(formData, "required"),
    optional: checkbox(formData, "optional"),
    doubling: checkbox(formData, "doubling"),
    doubled_instrument_id: formData.get("doubled_instrument_id") ?? "",
    substitutable: checkbox(formData, "substitutable"),
    notes: formData.get("notes") ?? "",
    source: formData.get("source") ?? "",
  });
}
