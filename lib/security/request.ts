import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

export async function getRequestIp() {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const realIp = headerStore.get("x-real-ip");
  const cfConnectingIp = headerStore.get("cf-connecting-ip");

  return (
    forwardedFor?.split(",")[0]?.trim() ||
    realIp?.trim() ||
    cfConnectingIp?.trim() ||
    "unknown"
  );
}

export function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toLowerCase();
}

export function formString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export function hashForSecurityLog(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isHoneypotFilled(formData: FormData) {
  return formString(formData.get("company")).length > 0;
}

