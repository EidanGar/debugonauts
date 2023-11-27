import { z } from "zod"

export const userSignUpSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, {
      message: "Email must be at least 3 characters.",
    })
    .max(255, {
      message: "Email must be at most 255 characters.",
    }),
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(255, {
      message: "Username must be at most 255 characters.",
    }),
})

export type UserSignUpData = z.infer<typeof userSignUpSchema>
