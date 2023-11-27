import prisma from "@/lib/db"
import { userSignUpSchema } from "@/lib/validations/signup"
import { SignUpData } from "@/components/auth-context"

export async function POST(req: Request) {
  const { email, username, verificationCode } = (await req.json()) as SignUpData

  try {
    const validatedData = userSignUpSchema.parse({
      email,
      username,
    })
    console.log("Check 1")

    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      console.log("User already exists")
      return new Response("User already exists", { status: 409 })
    }

    // send user magic link and await email verification

    // create user
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
      },
    })

    return new Response(JSON.stringify(user), { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 })
    } else {
      return new Response("Bad request", { status: 400 })
    }
  }
}
