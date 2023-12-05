import bcryptjs from "bcryptjs"

import prisma from "@/lib/db"
import { UserSignInData, userSignInSchema } from "@/lib/validations/signin"

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as UserSignInData

  try {
    const { email: validatedEmail, password: validatedPwd } =
      userSignInSchema.parse({
        email,
        password,
      })

    // check if user already exists and has a different provider
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedEmail,
      },
    })

    if (!existingUser) {
      return new Response(
        JSON.stringify({
          isError: true,
          user: null,
          error: {
            title: "User does not exist",
            description:
              "Please sign up first if you don't have an account, or press \"can't sign in\" if you need help.",
          },
        }),
        {
          status: 403,
        }
      )
    }

    if (existingUser?.provider !== "EMAIL") {
      return new Response(
        JSON.stringify({
          isError: true,
          user: null,
          error: {
            title: "Email already in use",
            description: "This user already exists with a different provider.",
          },
          provider: existingUser?.provider,
        }),
        { status: 409 }
      )
    }

    // check password
    const passwordMatch = await bcryptjs.compare(
      validatedPwd + existingUser.salt,
      existingUser.hashedPwd
    )

    if (!passwordMatch) {
      return new Response(
        JSON.stringify({
          isError: true,
          user: null,
          error: {
            title: "Password does not match",
            description: "The password you entered is incorrect.",
          },
        }),
        { status: 403 }
      )
    }

    return new Response(
      JSON.stringify({
        isError: false,
        user: existingUser,
        error: null,
      }),
      {
        status: 200,
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          title: "Invalid email address",
          description: error.message,
        }),
        { status: 400 }
      )
    } else {
      return new Response(
        JSON.stringify({
          title: "Invalid email address",
          description: "Something went wrong",
        }),
        { status: 400 }
      )
    }
  }
}
