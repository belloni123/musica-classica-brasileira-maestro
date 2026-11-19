import { z } from "zod";
import { orchestraTypes } from "@/lib/catalog/options";
import { composerReliabilityLevels } from "@/lib/validators/composer";

export const entities = ["composers", "conductors", "works"] as const;
export const entitySchema = z.enum(entities);
export type CatalogEntity = z.infer<typeof entitySchema>;

export const slug = z.string().max(160).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
export const catalogQuery = {
  entity: entitySchema,
  q: z.string().trim().max(100).optional(),
  slug: slug.optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).max(100_000).optional(),
};

const text = z.string().trim().max(10_000).nullable();
const year = z.number().int().min(0).max(3000).nullable();
const list = z.array(z.string().trim().min(1).max(500)).max(50);
const date = z.string().date().nullable();
const minutes = z.number().min(0).max(9999.99).nullable();
const status = z.enum(["draft", "in_review", "published", "archived"]);
const reliability = z.enum(composerReliabilityLevels);

const peopleFields = {
  canonical_name: z.string().trim().min(2).max(300),
  display_name: z.string().trim().min(2).max(300),
  birth_year: year,
  death_year: year,
  short_biography: text,
  long_biography: text,
};

const rowKey = { slug };
const baseFields = { publication_status: status };
export const importRows = {
  composers: z.object({
    ...baseFields, ...peopleFields,
    surname: text, alternative_names: list, pseudonyms: list, birth_date: date, death_date: date,
    birth_city: text, birth_state: text, birth_country: text, death_city: text, death_state: text,
    nationality: text, gender: text, ethnicity_identity: text, brazil_region: text, biography_source: text,
    official_website: z.string().url().regex(/^https?:\/\//i).max(2000).nullable(),
    notes: text, reliability_level: reliability,
  }).partial().extend(rowKey).strict(),
  conductors: z.object({ ...baseFields, ...peopleFields }).partial().extend(rowKey).strict(),
  works: z.object({
    ...baseFields,
    composer_slug: slug,
    canonical_title: z.string().trim().min(1).max(500),
    display_title: z.string().trim().min(1).max(500),
    alternative_titles: list, original_title: text, translated_title: text,
    composition_year_start: year, composition_year_end: year, composition_date_text: text, revision_year: year,
    opus: text, catalog: text, catalog_number: text, duration_minutes: minutes,
    duration_minimum: z.number().int().min(0).max(100_000).nullable(),
    duration_maximum: z.number().int().min(0).max(100_000).nullable(),
    formation_type: z.enum(orchestraTypes).nullable(), difficulty_level: text,
    soloist_type: z.enum(["none", "vocal", "instrumental"]).nullable(),
    has_choir: z.boolean(), has_electronics: z.boolean(), has_brazilian_instruments: z.boolean(),
    educational_work: z.boolean(), youth_work: z.boolean(), public_domain: z.boolean(),
    rights_status: text, work_status: text, public_summary: text, subscriber_notes: text,
    performance_notes: text, editorial_notes: text, main_source: text, instrumentation_text: text,
    reliability_level: reliability,
  }).partial().extend(rowKey).strict(),
};

export const batchInput = {
  entity: entitySchema,
  file_name: z.string().trim().min(1).max(255),
  rows: z.array(z.record(z.unknown())).min(1).max(100),
};
export const planField = z.string().regex(/^[a-f0-9]{32}$/);
export const importRequest = z.discriminatedUnion("mode", [
  z.object({ ...batchInput, mode: z.literal("preview") }).strict(),
  z.object({ ...batchInput, mode: z.literal("apply"), plan: planField }).strict(),
]);
export type CatalogImport = z.infer<typeof importRequest>;
