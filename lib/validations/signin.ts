import { z } from "zod"

export const userSignInSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
})

export type UserSignInData = z.infer<typeof userSignInSchema>
