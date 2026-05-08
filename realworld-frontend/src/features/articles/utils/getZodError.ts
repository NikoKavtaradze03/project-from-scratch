import type { ZodType } from "zod";

function getZodError(schema: ZodType, value: unknown) {
  const result = schema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
}

export default getZodError;
