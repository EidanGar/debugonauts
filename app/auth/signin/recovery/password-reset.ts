import { z } from "zod"

export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .max(100)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
        message:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      }),
    passwordConfirmation: z.string().min(8).max(100),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  })

export type PasswordResetData = z.infer<typeof passwordResetSchema>
