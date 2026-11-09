"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setMessage("");

    const formData = new FormData(formElement);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok)
        throw new Error(
          result.message || "Unable to send your message. Please try again.",
        );

      formElement.reset();
      setState("success");
      setMessage("Thanks — your message has been sent.");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          name="name"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={80}
          required
        />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
        />
      </label>
      <label>
        Message
        <textarea
          name="message"
          rows={6}
          minLength={10}
          maxLength={3000}
          required
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        className="button button-primary"
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Sending…" : "Send message"}
        <span aria-hidden="true">↗</span>
      </button>
      <p
        className={`form-feedback ${state}`}
        role={state === "error" ? "alert" : "status"}
        aria-live={state === "error" ? "assertive" : "polite"}
      >
        {message}
      </p>
    </form>
  );
}
