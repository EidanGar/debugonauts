import { z } from "zod"

export const accountRecoverySchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, {
      message: "Email must be at least 3 characters.",
    })
    .max(255, {
      message: "Email must be at most 255 characters.",
    }),
})

export type AccountRecoveryData = z.infer<typeof accountRecoverySchema>
