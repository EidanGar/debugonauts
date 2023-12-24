import { Visibility } from "@prisma/client"
import { z } from "zod"

export const stringPreprocessor = (foo: any) => {
  if (!foo || typeof foo !== "string") return undefined
  return foo === "" ? undefined : foo
}

export const profileSchema = z.object({
  name: z.preprocess(
    stringPreprocessor,
    z
      .string({
        invalid_type_error: "Name must be a string",
      })
      .min(3, {
        message: "The name must be at least 3 characters in length.",
      })
      .max(50, {
        message: "The name must not exceed 50 characters in length.",
      })
      .optional()
  ),
  bio: z.preprocess(
    stringPreprocessor,
    z
      .string()
      .min(3, {
        message: "The profile bio must be at least 3 characters in length.",
      })
      .max(500, {
        message: "The profile bio must not exceed 500 characters in length.",
      })
      .optional()
  ),
  jobTitle: z.preprocess(
    stringPreprocessor,
    z
      .string()
      .min(3, {
        message: "The job title must be at least 3 characters in length.",
      })
      .max(50, {
        message: "The job title must not exceed 50 characters in length.",
      })
      .optional()
  ),
  department: z.preprocess(
    stringPreprocessor,
    z
      .string()
      .min(2, {
        message: "The department must be at least 3 characters in length.",
      })
      .max(50, {
        message: "The department must not exceed 50 characters in length.",
      })
      .optional()
  ),

  organization: z.preprocess(
    stringPreprocessor,
    z
      .string()
      .min(2, {
        message: "The organization must be at least 3 characters in length.",
      })
      .max(50, {
        message: "The organization must not exceed 50 characters in length.",
      })
      .optional()
  ),
  bannerImage: z.preprocess(stringPreprocessor, z.string().url().optional()),
  image: z.preprocess(stringPreprocessor, z.string().url().optional()),
  email: z.string().email({
    message: "This is not a valid email address.",
  }),
  emailVisibility: z
    .enum([Visibility.PUBLIC, Visibility.PRIVATE])
    .default(Visibility.PUBLIC),
  location: z.preprocess(stringPreprocessor, z.string().optional()),
  locationVisibility: z
    .enum([Visibility.PUBLIC, Visibility.PRIVATE])
    .default(Visibility.PUBLIC),
})

export type ProfileData = z.infer<typeof profileSchema>

export type UpdateProfileRequest = {
  userId: string
} & ProfileData

export interface UpdateProfileResponse {
  isError: boolean
  profile: ProfileData | null
  error: {
    title: string
    description: string
  } | null
}
