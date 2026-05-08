import { z } from "zod";

export const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be under 120 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(300, "Description must be under 300 characters"),

  body: z.string().trim().min(1, "Article body is required"),

  tagList: z.array(
    z.string().trim().min(1).max(30, "Tags must be under 30 characters"),
  ),
});
