import { NextRequest } from "next/server"
import { Project, User, Visibility } from "@prisma/client"
import { getToken } from "next-auth/jwt"

import prisma from "@/lib/db"

export interface ProjectWithFullLead {
  id: Project["id"]
  projectKey: Project["projectKey"]
  name: Project["name"]
  visibility: Visibility
  projectLead: User
}

export interface ProjectsFetchData {
  isError: boolean
  projectsWithLeads: ProjectWithFullLead[]
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

  // find all projects along with thier project lead
  const projectsWithLeads = await prisma.project.findMany({
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
    select: {
      id: true,
      projectKey: true,
      projectLead: true,
      name: true,
      visibility: true,
    },
  })

  return new Response(
    JSON.stringify({
      isError: false,
      projectsWithLeads,
      error: null,
    } as ProjectsFetchData),
    {
      status: 200,
    }
  )
}
