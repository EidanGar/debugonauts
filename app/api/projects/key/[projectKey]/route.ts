import { Issue, Project, Role, Team, TeamMember, User } from "@prisma/client"

import prisma from "@/lib/db"

interface Params {
  params: {
    projectKey: string
  }
}

export interface FullProject extends Project {
  members:
    | TeamMember[]
    | {
        id: string
        projectId: string
        userId: string
        role: Role
        createdAt: Date
      }[]
  issues: Issue[]
  projectLead: User | null
  teams: Team[]
  User: User | null
}

export async function GET(req: Request, { params: { projectKey } }: Params) {
  const project = await prisma.project.findUnique({
    where: {
      projectKey,
    },
    select: {
      members: true,
      name: true,
      description: true,
      repository: true,
      tags: true,
      visibility: true,
      projectKey: true,
      createdAt: true,
      updatedAt: true,
      id: true,
      issues: true,
      projectLead: true,
      projectLeadId: true,
      teams: true,
      User: true,
      userId: true,
    },
  })

  if (!project) {
    return new Response(
      JSON.stringify({
        isError: true,
        project: null,
        error: {
          title: "Project not found",
          description: "Project not found",
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
      project: project as FullProject,
      error: null,
    }),
    {
      status: 200,
    }
  )
}
