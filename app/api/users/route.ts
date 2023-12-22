import { User } from "next-auth"

import prisma from "@/lib/db"

export interface UsersFetchResponse {
  isError: boolean
  users: User[] | null
  error: {
    title: string
    description: string
  } | null
}

export async function POST(req: Request) {
  const { userIds } = (await req.json()) as { userIds: string[] }

  const users = await prisma.user.findMany(
    userIds.length
      ? {
          where: {
            id: {
              in: userIds,
            },
          },
        }
      : undefined
  )

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
