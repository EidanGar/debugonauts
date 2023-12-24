import prisma from "@/lib/db"
import { UserData } from "@/hooks/useAuth"

export interface UserFetchResponse {
  isError: boolean
  user: UserData | null
  error: {
    title: string
    description: string
  } | null
}

export async function GET(
  req: Request,
  {
    params: { email },
  }: {
    params: {
      email: string
    }
  }
) {
  console.log("Route email", email)

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return new Response(
      JSON.stringify({
        isError: true,
        user: null,
        error: {
          title: "User not found",
          description: "The user you are trying to fetch does not exist.",
        },
      }),
      {
        status: 404,
      }
    )
  }

  return new Response(
    JSON.stringify({
      isError: false,
      user,
      error: null,
    }),
    {
      status: 200,
    }
  )
}
