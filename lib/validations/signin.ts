import { Provider, User } from "@prisma/client"
import { z } from "zod"

export const userSignInSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
})

export type UserSignInData = z.infer<typeof userSignInSchema>

export type SignInResoponse = User & {
  title: string
  description: string
  provider?: Provider
}
