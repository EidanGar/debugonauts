import { Visibility } from "@prisma/client"
import { z } from "zod"

export const profileSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    // the name shouldnt be checked unless supplied
    .min(3, {
      message: "The name must be at least 3 characters in length.",
    })
    .max(50, {
      message: "The name must not exceed 50 characters in length.",
    })
    .optional(),
  bio: z
    .string()
    .min(3, {
      message: "The profile bio must be at least 3 characters in length.",
    })
    .max(500, {
      message: "The profile bio must not exceed 500 characters in length.",
    })
    .optional(),
  jobTitle: z
    .string()
    .min(3, {
      message: "The job title must be at least 3 characters in length.",
    })
    .max(50, {
      message: "The job title must not exceed 50 characters in length.",
    })
    .optional(),
  department: z
    .string()
    .min(2, {
      message: "The department must be at least 3 characters in length.",
    })
    .max(50, {
      message: "The department must not exceed 50 characters in length.",
    })
    .optional(),

  organization: z
    .string()
    .min(2, {
      message: "The organization must be at least 3 characters in length.",
    })
    .max(50, {
      message: "The organization must not exceed 50 characters in length.",
    })
    .optional(),

  bannerImage: z.string().optional(),
  image: z.string().optional(),
  email: z
    .string()
    .email({
      message: "The email address is not valid.",
    })
    .optional(),
  emailVisibility: z
    .enum([Visibility.PUBLIC, Visibility.PRIVATE])
    .default(Visibility.PUBLIC),
  location: z.string().optional(),
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
