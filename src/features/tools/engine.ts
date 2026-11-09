import type { ToolId } from "@/features/tools/registry";

const MAX_TEXT_LENGTH = 200_000;
const MAX_TOKEN_LENGTH = 16_384;

type ToolResult = { output: string; note?: string };

function assertLength(value: string, maximum: number): void {
  if (value.length > maximum) {
    throw new Error(
      `Input is too large. Maximum length is ${maximum.toLocaleString()} characters.`,
    );
  }
}

function decodeBase64Url(value: string): string {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length % 4 === 1) {
    throw new Error("JWT contains an invalid Base64URL segment.");
  }

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function decodeJwtObject(
  segment: string,
  label: "header" | "payload",
): unknown {
  const decoded: unknown = JSON.parse(decodeBase64Url(segment));
  if (
    typeof decoded !== "object" ||
    decoded === null ||
    Array.isArray(decoded)
  ) {
    throw new Error(`JWT ${label} must be a JSON object.`);
  }
  return decoded;
}

function encodeBase64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  const chunkSize = 0x8000;
  const chunks: string[] = [];

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    chunks.push(String.fromCharCode(...chunk));
  }

  return btoa(chunks.join(""));
}

function decodeBase64Utf8(value: string): string {
  const compact = value.replace(/\s/g, "");
  const unpadded = compact.replace(/=+$/, "");
  const hasOnlyBase64Characters = /^[A-Za-z0-9+/]*={0,2}$/.test(compact);
  const hasValidLength = unpadded.length % 4 !== 1;
  const hasValidPadding = !compact.includes("=") || compact.length % 4 === 0;
  if (!hasOnlyBase64Characters || !hasValidLength || !hasValidPadding) {
    throw new Error("Input is not valid Base64.");
  }

  const padded = unpadded.padEnd(Math.ceil(unpadded.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function createUuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function executeTool(
  toolId: ToolId,
  input: string,
  options?: {
    mode?: "encode" | "decode" | "format" | "minify";
    count?: number;
  },
): ToolResult {
  assertLength(input, MAX_TEXT_LENGTH);

  switch (toolId) {
    case "json-formatter": {
      if (!input.trim()) throw new Error("Paste a JSON value first.");
      const value: unknown = JSON.parse(input);
      const output =
        options?.mode === "minify"
          ? JSON.stringify(value)
          : JSON.stringify(value, null, 2);
      return { output: output ?? "null" };
    }
    case "jwt-decoder": {
      assertLength(input, MAX_TOKEN_LENGTH);
      const parts = input.trim().split(".");
      if (
        parts.length !== 3 ||
        parts.some(
          (part) =>
            !part || !/^[A-Za-z0-9_-]+$/.test(part) || part.length % 4 === 1,
        )
      ) {
        throw new Error(
          "A JWT must contain three valid non-empty Base64URL segments.",
        );
      }
      const header = decodeJwtObject(parts[0] ?? "", "header");
      const payload = decodeJwtObject(parts[1] ?? "", "payload");
      return {
        output: `HEADER\n${JSON.stringify(header, null, 2)}\n\nPAYLOAD\n${JSON.stringify(payload, null, 2)}`,
        note: "Decoded only. The JWT signature, issuer, audience and expiration have not been verified.",
      };
    }
    case "base64": {
      if (!input) throw new Error("Enter some text first.");
      if (options?.mode === "decode") {
        return { output: decodeBase64Utf8(input) };
      }
      return { output: encodeBase64Utf8(input) };
    }
    case "uuid-generator": {
      const requestedCount = options?.count ?? 1;
      const safeCount = Number.isFinite(requestedCount)
        ? Math.trunc(requestedCount)
        : 1;
      const count = Math.min(20, Math.max(1, safeCount));
      return { output: Array.from({ length: count }, createUuid).join("\n") };
    }
    case "text-counter": {
      const words =
        input.trim().match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? [];
      const lines = input.length === 0 ? 0 : input.split(/\r\n|\r|\n/).length;
      const readingMinutes = input.trim()
        ? Math.max(1, Math.ceil(words.length / 200))
        : 0;
      return {
        output: [
          `Words: ${words.length}`,
          `Characters: ${input.length}`,
          `Characters without spaces: ${input.replace(/\s/g, "").length}`,
          `Lines: ${lines}`,
          `Estimated reading time: ${readingMinutes} min`,
        ].join("\n"),
      };
    }
    default: {
      const exhaustive: never = toolId;
      throw new Error(`Unsupported tool: ${exhaustive}`);
    }
  }
}
