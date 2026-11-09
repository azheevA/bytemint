export const MAX_REQUEST_BODY_BYTES = 10_000;

export class RequestBodyTooLargeError extends Error {
  constructor() {
    super("Request body is too large.");
    this.name = "RequestBodyTooLargeError";
  }
}

/**
 * JSON form submissions from a browser carry an Origin header. In production,
 * reject requests without it and compare it with the Host header seen by Next.js.
 * Do not trust x-forwarded-host here: it is a proxy header and may be client
 * supplied when the reverse proxy is not configured to overwrite it.
 */
export function hasAllowedOrigin(
  request: Request,
  allowMissingOrigin = false,
): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return allowMissingOrigin;

  const requestHost = request.headers.get("host");
  if (!requestHost) return false;

  try {
    const originUrl = new URL(origin);
    if (
      originUrl.protocol !== "https:" &&
      process.env.NODE_ENV === "production"
    ) {
      return false;
    }
    return originUrl.host.toLowerCase() === requestHost.toLowerCase();
  } catch {
    return false;
  }
}

/** Reads a request stream while enforcing a byte limit before UTF-8 decoding. */
export async function readLimitedBody(
  request: Request,
  maximumBytes = MAX_REQUEST_BODY_BYTES,
): Promise<string> {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader !== null) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > maximumBytes) {
      throw new RequestBodyTooLargeError();
    }
  }

  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maximumBytes) {
        await reader.cancel().catch(() => undefined);
        throw new RequestBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
