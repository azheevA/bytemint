import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/contact";

describe("contactSchema", () => {
  it("accepts a valid contact message", () => {
    const result = contactSchema.safeParse({
      name: "Alex Developer",
      email: "alex@example.com",
      message: "I have an idea for a new tool.",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Alex",
      email: "not-an-email",
      message: "A message long enough.",
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects control characters in the name", () => {
    const result = contactSchema.safeParse({
      name: "Alex\nInjected header",
      email: "alex@example.com",
      message: "A message long enough.",
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace before validation", () => {
    const result = contactSchema.safeParse({
      name: "  Alex  ",
      email: "  alex@example.com  ",
      message: "  A message long enough.  ",
      website: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Alex");
      expect(result.data.email).toBe("alex@example.com");
    }
  });

  it("rejects unknown fields", () => {
    const result = contactSchema.safeParse({
      name: "Alex",
      email: "alex@example.com",
      message: "A message long enough.",
      admin: true,
    });
    expect(result.success).toBe(false);
  });
});
