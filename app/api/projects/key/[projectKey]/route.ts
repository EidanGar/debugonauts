import { NextRequest } from "next/server"
import { IssueData } from "@/prisma/zod/issues"
import { Project, ProjectMember, Team, User } from "@prisma/client"
import { getToken } from "next-auth/jwt"

import prisma from "@/lib/db"

export const fetchProjectData = async (projectKey: string) => {
  const response = await fetch(`/api/projects/key/${projectKey}`)
  if (!response.ok) throw new Error("Failed to fetch project data")
  const projectData: ProjectResponse = await response.json()
  return projectData.project as FullProject
}

interface Params {
  params: {
    projectKey: string
  }
}

export type ProjectUser = ProjectMember & {
  user: User
}

export interface FullProject extends Project {
  members: ProjectUser[]
  issues: IssueData[]
  projectLead: User | null
  teams: Team[]
  User: User | null
  issueCount: number
}

export interface ProjectResponse {
  isError: boolean
  project: FullProject | null
  error: {
    title: string
    description: string
  } | null
}

export async function GET(
  req: NextRequest,
  { params: { projectKey } }: Params
) {
  const token = await getToken({
    req,
    secret: process.env.SECRET,
  })

  const authenticatedUserdId = token?.sub

  const project = await prisma.project.findUnique({
    where: {
      projectKey,
      OR: [
        {
          members: {
            some: {
              userId: authenticatedUserdId,
            },
          },
          projectLeadId: authenticatedUserdId,
        },
      ],
    },
    select: {
      members: {
        include: {
          user: true,
        },
      },
      name: true,
      description: true,
      repository: true,
      tags: true,
      visibility: true,
      projectKey: true,
      createdAt: true,
      updatedAt: true,
      id: true,
      issues: {
        include: {
          comments: true,
          assignee: true,
          tags: true,
          reporter: true,
        },
      },
      projectLead: true,
      projectLeadId: true,
      teams: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
      User: true,
      userId: true,
    },
  })

  const issueCount = project?.issues.length

  const fullProject = {
    ...project,
    issueCount,
  } as FullProject

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
      project: fullProject,
      error: null,
    } as ProjectResponse),
    {
      status: 200,
    }
  )
}
