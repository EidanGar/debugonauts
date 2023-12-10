import { User } from "@prisma/client"
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
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(30, { message: "Pass must be less than 30 characters" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one symbol.",
    }),
})

export type UserSignUpData = z.infer<typeof userSignUpSchema>

export type UserSignUpResponse = {
  isError: boolean
  error?: {
    title: string
    description: string
  }
  user: User | null
}
