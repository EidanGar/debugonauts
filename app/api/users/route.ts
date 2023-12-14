import { User } from "next-auth"

import prisma from "@/lib/db"

export interface UserFetchResponse {
  isError: boolean
  users: User | User[] | null
  error: {
    title: string
    description: string
  } | null
}

export async function POST(req: Request) {
  const { userIds } = (await req.json()) as { userIds: string | string[] }

  if (Array.isArray(userIds)) {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    })

    return new Response(
      JSON.stringify({
        isError: false,
        users,
        error: null,
      }),
      {
        status: 200,
      }
    )
  }

  const foundUser = await prisma.user.findUnique({
    where: {
      id: userIds,
    },
  })

  if (!foundUser) {
    return new Response(
      JSON.stringify({
        isError: true,
        users: null,
        error: {
          title: "User not found",
          description: "This user does not exist",
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
      users: foundUser,
      error: null,
    }),
    {
      status: 200,
    }
  )
}
