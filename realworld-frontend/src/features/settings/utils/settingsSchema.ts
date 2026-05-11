import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value: string) => {
      if (!value) return true;

      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Enter a valid image URL" },
  );

export const settingsSchema = z.object({
  image: optionalUrl,

  username: z.string().trim().min(1, "Username is required"),

  bio: z.string().trim().max(500, "Bio must be under 500 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email")),

  password: z
    .string()
    .refine(
      (value: string) => value === "" || value.length >= 8,
      "Password must be at least 8 characters",
    ),
});
