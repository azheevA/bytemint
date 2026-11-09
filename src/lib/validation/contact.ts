import { z } from "zod";

export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters.")
      .max(80, "Name is too long.")
      .regex(
        /^[^\u0000-\u001f\u007f]+$/,
        "Name contains unsupported control characters.",
      ),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email address is too long."),
    message: z
      .string()
      .trim()
      .min(10, "Message must contain at least 10 characters.")
      .max(3000, "Message is too long.")
      .refine(
        (value) => !value.includes("\u0000"),
        "Message contains an unsupported character.",
      ),
    website: z.string().max(200).optional(),
  })
  .strict();

export type ContactInput = z.infer<typeof contactSchema>;
