import { NextRequest } from "next/server"
import { Project } from "@prisma/client"
import { getToken } from "next-auth/jwt"

import prisma from "@/lib/db"

export interface ProjectsFetchResponse {
  isError: boolean
  projects: Project[]
  error: {
    title: string
    description: string
  } | null
}

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.SECRET! })

  if (!token) {
    return new Response(
      JSON.stringify({
        isError: true,
        projects: null,
        error: {
          title: "Not authenticated",
          description: "You need to be signed in to view this page.",
        },
      }),
      {
        status: 403,
      }
    )
  }

  // find all projects that the user is a member or project lead of
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        {
          members: {
            some: {
              userId: token.sub,
            },
          },
        },
        {
          projectLeadId: token.sub,
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
