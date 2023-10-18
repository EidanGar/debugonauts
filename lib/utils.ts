import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// turn text into a slug
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

// truncate text after a certain length
export function truncate(text: string, length: number) {
  if (text.length > length) {
    return text.slice(0, length) + "..."
  }
  return text
}

// function that takes a zod schema and an object and validates that object
// against the schema. If the object is valid, it returns the object, otherwise
// it throws an error.
export async function validateSchema<T>(
  schema: z.ZodSchema<T>,
  obj: any
): Promise<T | z.ZodError | Error> {
  try {
    return (await schema.parseAsync(obj)) as T
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Error(
        err.issues.map((issue) => issue.message).join(", ")
      ) as z.ZodError
    }
    return err as Error
  }
}
