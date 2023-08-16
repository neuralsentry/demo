import { z } from "zod";
import type { Request } from "express";
import type { AnyZodObject } from "zod";

export async function validate<T extends AnyZodObject>(
  schema: T,
  req: Request
): Promise<z.infer<T>> {
  try {
    return schema.parseAsync(req);
  } catch (error) {
    throw error;
  }
}

export function zId(type: z.ZodType) {
  return type.refine((val) => {
    const regex = /^\d+$/;
    return regex.test(val);
  }, "Id must be a number");
}
