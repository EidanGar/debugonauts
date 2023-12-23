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

export async function GET(
  req: Request,
  {
    params: { userId },
  }: {
    params: {
      userId: string
    }
  }
) {
  // find all projects that the user is a member or project lead of
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        {
          members: {
            some: {
              userId,
            },
          },
        },
        {
          projectLeadId: userId,
        },
      ],
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
