import { describe, expect, it } from "vitest";
import {
  hasAllowedOrigin,
  readLimitedBody,
  RequestBodyTooLargeError,
} from "@/lib/security/request";

function requestWithHeaders(headers: HeadersInit = {}): Request {
  return new Request("https://bytemint.example/api/contact", {
    method: "POST",
    headers: {
      host: "bytemint.example",
      ...Object.fromEntries(new Headers(headers).entries()),
    },
    body: "{}",
  });
}

describe("contact request security", () => {
  it("allows an Origin that matches the request host", () => {
    expect(
      hasAllowedOrigin(
        requestWithHeaders({ origin: "https://bytemint.example" }),
      ),
    ).toBe(true);
  });

  it("rejects a cross-origin request", () => {
    expect(
      hasAllowedOrigin(
        requestWithHeaders({ origin: "https://attacker.example" }),
      ),
    ).toBe(false);
  });

  it("does not accept a missing Origin when production policy requires it", () => {
    expect(hasAllowedOrigin(requestWithHeaders(), false)).toBe(false);
  });

  it("can allow a missing Origin in local development", () => {
    expect(hasAllowedOrigin(requestWithHeaders(), true)).toBe(true);
  });

  it("rejects an Origin when only an untrusted forwarded host matches it", () => {
    const request = new Request("https://bytemint.example/api/contact", {
      method: "POST",
      headers: {
        host: "bytemint.example",
        origin: "https://attacker.example",
        "x-forwarded-host": "attacker.example",
      },
      body: "{}",
    });
    expect(hasAllowedOrigin(request)).toBe(false);
  });

  it("reads a UTF-8 request body", async () => {
    const request = new Request("https://bytemint.example", {
      method: "POST",
      body: JSON.stringify({ message: "Привет" }),
    });
    await expect(readLimitedBody(request)).resolves.toBe(
      '{"message":"Привет"}',
    );
  });

  it("enforces the body limit using bytes, not JavaScript characters", async () => {
    const request = new Request("https://bytemint.example", {
      method: "POST",
      body: "Привет",
    });
    await expect(readLimitedBody(request, 5)).rejects.toBeInstanceOf(
      RequestBodyTooLargeError,
    );
  });

  it("rejects an oversized declared Content-Length before reading", async () => {
    const request = new Request("https://bytemint.example", {
      method: "POST",
      headers: { "content-length": "100" },
      body: "{}",
    });
    await expect(readLimitedBody(request, 10)).rejects.toBeInstanceOf(
      RequestBodyTooLargeError,
    );
  });
});
