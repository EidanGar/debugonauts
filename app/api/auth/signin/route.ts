import prisma from "@/lib/db"
import { userSignInSchema } from "@/lib/validations/signin"
import { SignInData } from "@/components/auth-context"

export async function POST(req: Request) {
  const { email, verificationCode } = (await req.json()) as SignInData

  try {
    const validatedData = userSignInSchema.parse({
      email,
    })
    console.log("Check 1")

    // check if user already exists and has a provider that is not email
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (!existingUser) {
      console.log("User does not exist")
      return new Response(
        JSON.stringify({
          title: "User does not exist",
          description:
            "Please sign up first if you don't have an account, or press \"can't sign in\" if you need help.",
        }),
        {
          status: 403,
        }
      )
    }

    if (existingUser?.provider !== "EMAIL") {
      console.log("This user already exists with a different provider.")
      return new Response(
        JSON.stringify({
          title: "Email already in use",
          description: "This user already exists with a different provider.",
          provider: existingUser?.provider,
        }),
        { status: 409 }
      )
    }

    // send user magic link and await email verification

    return new Response(JSON.stringify(existingUser), {
      status: 200,
    })
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
