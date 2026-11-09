"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { executeTool } from "@/features/tools/engine";
import type { ToolDefinition } from "@/features/tools/registry";

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<"encode" | "decode" | "format" | "minify">(
    () => (tool.id === "base64" ? "encode" : "format"),
  );
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const textStats = useMemo(() => {
    if (tool.id !== "text-counter") return null;
    const words =
      input.trim().match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? [];
    return {
      words: words.length,
      characters: input.length,
      compact: input.replace(/\s/g, "").length,
      lines: input.length === 0 ? 0 : input.split(/\r\n|\r|\n/).length,
      reading: input.trim() ? Math.max(1, Math.ceil(words.length / 200)) : 0,
    };
  }, [input, tool.id]);

  function run(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError("");
    setNote("");
    setCopied(false);

    try {
      const result = executeTool(tool.id, input, { mode, count });
      setOutput(result.output);
      setNote(result.note ?? "");
    } catch (caught) {
      setOutput("");
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to process this input.",
      );
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError(
        "Clipboard access was blocked. Select and copy the result manually.",
      );
    }
  }

  return (
    <div className="workspace">
      <form className="workspace-panel" onSubmit={run}>
        <div className="workspace-panel-heading">
          <div>
            <span className="eyebrow">Input</span>
            <h2>{tool.inputLabel}</h2>
          </div>
          <span className="local-indicator">
            <span /> Local processing
          </span>
        </div>

        {tool.id === "uuid-generator" ? (
          <div className="uuid-control">
            <label htmlFor="uuid-count">How many UUIDs?</label>
            <input
              id="uuid-count"
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(event) =>
                setCount(
                  Math.min(20, Math.max(1, Number(event.target.value) || 1)),
                )
              }
            />
            <p>Generate between 1 and 20 random UUID v4 identifiers.</p>
          </div>
        ) : (
          <>
            {tool.id === "json-formatter" ? (
              <div
                className="mode-switch"
                role="group"
                aria-label="JSON output mode"
              >
                <button
                  type="button"
                  aria-pressed={mode === "format"}
                  className={mode === "format" ? "active" : ""}
                  onClick={() => setMode("format")}
                >
                  Pretty print
                </button>
                <button
                  type="button"
                  aria-pressed={mode === "minify"}
                  className={mode === "minify" ? "active" : ""}
                  onClick={() => setMode("minify")}
                >
                  Minify
                </button>
              </div>
            ) : null}
            {tool.id === "base64" ? (
              <div
                className="mode-switch"
                role="group"
                aria-label="Base64 operation"
              >
                <button
                  type="button"
                  aria-pressed={mode === "encode"}
                  className={mode === "encode" ? "active" : ""}
                  onClick={() => setMode("encode")}
                >
                  Encode
                </button>
                <button
                  type="button"
                  aria-pressed={mode === "decode"}
                  className={mode === "decode" ? "active" : ""}
                  onClick={() => setMode("decode")}
                >
                  Decode
                </button>
              </div>
            ) : null}
            <textarea
              className="tool-input"
              aria-label={tool.inputLabel}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={tool.placeholder}
              spellCheck={
                tool.id === "json-formatter" || tool.id === "jwt-decoder"
                  ? false
                  : true
              }
              maxLength={tool.id === "jwt-decoder" ? 16_384 : 200_000}
              rows={
                tool.id === "json-formatter" || tool.id === "base64" ? 14 : 9
              }
            />
          </>
        )}

        {tool.id === "text-counter" && textStats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <strong>{textStats.words.toLocaleString()}</strong>
              <span>Words</span>
            </div>
            <div className="stat-card">
              <strong>{textStats.characters.toLocaleString()}</strong>
              <span>Characters</span>
            </div>
            <div className="stat-card">
              <strong>{textStats.compact.toLocaleString()}</strong>
              <span>No spaces</span>
            </div>
            <div className="stat-card">
              <strong>{textStats.lines.toLocaleString()}</strong>
              <span>Lines</span>
            </div>
            <div className="stat-card">
              <strong>{textStats.reading} min</strong>
              <span>Reading time</span>
            </div>
          </div>
        ) : null}

        <div className="workspace-actions">
          <button className="button button-primary" type="submit">
            {tool.id === "uuid-generator"
              ? "Generate UUIDs"
              : tool.id === "base64"
                ? mode === "decode"
                  ? "Decode Base64"
                  : "Encode Base64"
                : tool.id === "json-formatter"
                  ? mode === "minify"
                    ? "Minify JSON"
                    : "Format JSON"
                  : tool.id === "text-counter"
                    ? "Update result"
                    : tool.actionLabel}
            <span aria-hidden="true">→</span>
          </button>
          {tool.id !== "uuid-generator" && input ? (
            <button
              className="button button-ghost"
              type="button"
              onClick={() => {
                setInput("");
                setOutput("");
                setError("");
                setNote("");
              }}
            >
              Clear input
            </button>
          ) : null}
        </div>
        {error ? (
          <p className="tool-error" role="alert">
            {error}
          </p>
        ) : null}
        <p className="privacy-note">
          <span aria-hidden="true">⌑</span> {tool.privacyNote}
        </p>
      </form>

      <section
        className="workspace-panel output-panel"
        aria-label="Tool result"
      >
        <div className="workspace-panel-heading">
          <div>
            <span className="eyebrow">Output</span>
            <h2>Result</h2>
          </div>
          {output ? (
            <button className="copy-button" type="button" onClick={copyOutput}>
              {copied ? "Copied ✓" : "Copy result ↗"}
            </button>
          ) : null}
        </div>
        {output ? (
          <pre className="tool-output">
            <code>{output}</code>
          </pre>
        ) : (
          <div className="empty-output">
            <span className="empty-output-icon" aria-hidden="true">
              ⌁
            </span>
            <strong>Your result will appear here</strong>
            <span>Enter your input and run the tool.</span>
          </div>
        )}
        {note ? <p className="result-note">{note}</p> : null}
        {tool.id === "text-counter" && textStats ? (
          <p className="result-note">
            Statistics update as you type. Press Update result to copy them as
            text.
          </p>
        ) : null}
      </section>
    </div>
  );
}
