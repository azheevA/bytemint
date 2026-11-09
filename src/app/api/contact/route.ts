import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  checkContactRateLimit,
  getRequestIdentifier,
} from "@/lib/security/rate-limit";
import { contactSchema } from "@/lib/validation/contact";
import {
  hasAllowedOrigin,
  readLimitedBody,
  RequestBodyTooLargeError,
} from "@/lib/security/request";

export const runtime = "nodejs";

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json(
    { message },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

export async function POST(request: Request) {
  const contentType = (request.headers.get("content-type") ?? "")
    .split(";")[0]
    ?.trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return jsonError("Content-Type must be application/json.", 415);
  }

  if (!hasAllowedOrigin(request, process.env.NODE_ENV !== "production")) {
    return jsonError("This request origin is not allowed.", 403);
  }

  const identifier = getRequestIdentifier(request);
  if (!identifier) {
    return jsonError(
      "Contact service is temporarily unavailable. Please try again later.",
      503,
    );
  }

  let limit;
  try {
    limit = await checkContactRateLimit(identifier);
  } catch {
    return jsonError(
      "Contact service is temporarily unavailable. Please try again later.",
      503,
    );
  }

  if (!limit.configured) {
    return jsonError(
      "Contact service is not configured for production yet.",
      503,
    );
  }

  if (!limit.allowed) {
    return jsonError("Too many messages. Please try again later.", 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  let rawBody: string;
  try {
    rawBody = await readLimitedBody(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return jsonError("Request body is too large.", 413);
    }
    return jsonError("Request body must be valid UTF-8.", 400);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonError("Request body must contain valid JSON.", 400);
  }

  if (typeof body === "object" && body !== null && "website" in body) {
    const website = (body as { website?: unknown }).website;
    if (typeof website === "string" && website.trim().length > 0) {
      return NextResponse.json(
        { message: "Thanks — your message has been sent." },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Please check the form fields.",
      422,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return jsonError("Contact delivery is not configured yet.", 503);
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: parsed.data.email,
      subject: `ByteMint contact message from ${parsed.data.name}`,
      text: [
        `Name: ${parsed.data.name}`,
        `Email: ${parsed.data.email}`,
        "",
        "Message:",
        parsed.data.message,
      ].join("\n"),
    });

    if (error)
      return jsonError("Message delivery failed. Please try again later.", 502);
    return NextResponse.json(
      { message: "Thanks — your message has been sent." },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return jsonError("Message delivery failed. Please try again later.", 502);
  }
}
