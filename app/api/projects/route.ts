import { Project } from "@prisma/client"

import prisma from "@/lib/db"

export interface ProjectsFetchResponse {
  isError: boolean
  projects: Project[]
  error: {
    title: string
    description: string
  } | null
}

export async function POST(req: Request) {
  const { userId } = (await req.json()) as { userId: string }

  console.log("UserId:", userId)

  const foundUser = await prisma.user.findUnique({
    where: {
      id: "d5463fe9-4b58-409d-8dca-9dbee4259e9f",
    },
  })

  if (!foundUser) {
    return new Response(
      JSON.stringify({
        isError: true,
        projects: [],
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

  // find all projects that the user is a member of
  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  })

  return new Response(
    JSON.stringify({
      isError: false,
      projects,
      error: null,
    }),
    {
      status: 200,
    }
  )
}
