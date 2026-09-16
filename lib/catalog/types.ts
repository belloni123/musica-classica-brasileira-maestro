export type WorkDetails = {
  subscriber_notes: string | null;
  performance_notes: string | null;
  main_source: string | null;
  instrumentation_text: string | null;
};

export function firstRelated<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function safeExternalUrl(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch { return null; }
}
