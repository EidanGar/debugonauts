import bcryptjs from "bcryptjs"
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

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export async function hashPassword(pwd: string, salt: string, number?: number) {
  return await bcryptjs.hash(pwd + salt, number ?? 10)
}

export function randomProjectKey() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  let key = ""

  for (let i = 0; i < 3; i++) {
    key += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }

  return key
}

export function generateVerificationCode() {
  const adjectives1 = [
    "Quick",
    "Bright",
    "Calm",
    "Daring",
    "Eager",
    "Fancy",
    "Gentle",
    "Happy",
    "Inventive",
    "Jolly",
  ]
  const adjectives2 = [
    "Royal",
    "Ancient",
    "Glorious",
    "Heroic",
    "Majestic",
    "Noble",
    "Valiant",
    "Sovereign",
    "Legendary",
    "Timeless",
  ]
  const nouns = [
    "Mountain",
    "River",
    "Sky",
    "Ocean",
    "Forest",
    "Desert",
    "Valley",
    "Star",
    "Moon",
    "Sun",
  ]

  // Randomly pick one adjective from each list and one noun
  const adjective1 = adjectives1[Math.floor(Math.random() * adjectives1.length)]
  const adjective2 = adjectives2[Math.floor(Math.random() * adjectives2.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]

  return `${adjective1} ${adjective2} ${noun}`
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
