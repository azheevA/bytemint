import { describe, expect, it } from "vitest";
import { executeTool } from "@/features/tools/engine";

describe("developer tools", () => {
  it("formats valid JSON", () => {
    expect(executeTool("json-formatter", '{"ok":true}').output).toBe(
      '{\n  "ok": true\n}',
    );
  });

  it("minifies JSON", () => {
    expect(
      executeTool("json-formatter", '{\n  "n": 1\n}', { mode: "minify" })
        .output,
    ).toBe('{"n":1}');
  });

  it("rejects invalid JSON", () => {
    expect(() => executeTool("json-formatter", '{"nope":')).toThrow();
  });

  it("decodes JWT header and payload without claiming signature validation", () => {
    const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" })).replace(
      /=/g,
      "",
    );
    const payload = btoa(JSON.stringify({ sub: "123", name: "Demo" })).replace(
      /=/g,
      "",
    );
    const result = executeTool("jwt-decoder", `${header}.${payload}.c2ln`);
    expect(result.output).toContain('"sub": "123"');
    expect(result.note).toContain("have not been verified");
  });

  it("encodes and decodes non-English UTF-8 text", () => {
    const encoded = executeTool("base64", "Привет, мир!").output;
    expect(executeTool("base64", encoded, { mode: "decode" }).output).toBe(
      "Привет, мир!",
    );
  });

  it("rejects malformed Base64 instead of decoding partial input", () => {
    expect(() => executeTool("base64", "%%%", { mode: "decode" })).toThrow(
      "valid Base64",
    );
  });

  it("rejects JWT segments outside the Base64URL alphabet", () => {
    expect(() => executeTool("jwt-decoder", "abc!.def.signature")).toThrow(
      "Base64URL",
    );
  });

  it("requires JWT header and payload to be JSON objects", () => {
    const header = btoa(JSON.stringify(["not", "an", "object"])).replace(
      /=/g,
      "",
    );
    const payload = btoa(JSON.stringify({ sub: "123" })).replace(/=/g, "");
    expect(() =>
      executeTool("jwt-decoder", `${header}.${payload}.c2ln`),
    ).toThrow("header must be a JSON object");
  });

  it("calculates text metrics", () => {
    const result = executeTool("text-counter", "Hello world\nByteMint").output;
    expect(result).toContain("Words: 3");
    expect(result).toContain("Lines: 2");
  });

  it("caps UUID generation", () => {
    const output = executeTool("uuid-generator", "", { count: 100 }).output;
    expect(output.split("\n")).toHaveLength(20);
    expect(
      output.split("\n").every((value) => /^[0-9a-f-]{36}$/.test(value)),
    ).toBe(true);
  });

  it("rejects oversized data", () => {
    expect(() => executeTool("base64", "a".repeat(200_001))).toThrow(
      "Input is too large",
    );
  });
});
