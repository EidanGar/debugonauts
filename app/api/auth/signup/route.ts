import { randomBytes } from "crypto"

import prisma from "@/lib/db"
import { hashPassword } from "@/lib/utils"
import { UserSignUpData, userSignUpSchema } from "@/lib/validations/signup"

export async function POST(req: Request) {
  const { email, username, password } = (await req.json()) as UserSignUpData

  try {
    const {
      email: validatedEmail,
      password: validatedPwd,
      username: validatedUsername,
    } = userSignUpSchema.parse({
      email,
      username,
      password,
    })

    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedEmail,
      },
    })

    if (existingUser) {
      return new Response(
        JSON.stringify({
          isError: true,
          user: null,
          error: {
            title: "User already exists",
            description: "A user with that email address already exists.",
          },
        }),
        { status: 409 }
      )
    }

    const userSalt = randomBytes(16).toString("hex")

    // create user
    const user = await prisma.user.create({
      data: {
        username: validatedUsername,
        email: validatedEmail,
        hashedPwd: await hashPassword(validatedPwd, userSalt),
        salt: userSalt,
      },
      select: {
        salt: false,
        hashedPwd: false,
        email: true,
        username: true,
        id: true,
        resetToken: true,
        resetTokenExpiry: true,
        photoUrl: true,
        provider: true,
        bio: true,
        contact: true,
        timezone: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return new Response(JSON.stringify({ isError: false, user }), {
      status: 201,
    })
  } catch (error) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          isError: true,
          user: null,
          error: {
            title: "Bad request",
            description: error.message,
          },
        }),
        { status: 400 }
      )
    } else {
      return new Response(
        JSON.stringify({
          title: "Bad request",
          description: "An unknown error occurred.",
        }),
        { status: 400 }
      )
    }
  }
}
