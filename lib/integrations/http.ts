import { z } from "zod";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export const publicHeaders = { "Access-Control-Allow-Origin": "*" };

export function jsonError(error: unknown, headers?: HeadersInit) {
  const failure = error instanceof ApiError ? error : new ApiError(503, "Serviço temporariamente indisponível.");
  return Response.json({ error: failure.message, details: failure.details }, { status: failure.status, headers });
}

export function validate<T>(schema: z.ZodType<T>, value: unknown) {
  const result = schema.safeParse(value);
  if (!result.success) throw new ApiError(400, "Dados inválidos.", result.error.issues);
  return result.data;
}

export async function readJson(request: Request) {
  const limit = 1_048_576;
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new ApiError(415, "Use Content-Type: application/json.");
  }
  if (Number(request.headers.get("content-length")) > limit) {
    throw new ApiError(413, "O corpo da solicitação excede 1 MiB.");
  }
  try {
    const decoded = new TextDecoder("utf-8", { fatal: true });
    const reader = request.body?.getReader();
    if (!reader) throw new ApiError(400, "Corpo JSON obrigatório.");
    let bytes = 0;
    let body = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new ApiError(413, "O corpo da solicitação excede 1 MiB.");
      }
      body += decoded.decode(value, { stream: true });
    }
    return JSON.parse(body + decoded.decode()) as unknown;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "JSON inválido.");
  }
}
