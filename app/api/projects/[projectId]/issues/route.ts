import { IssueData, IssueReqData } from "@/prisma/zod/issues"

import prisma from "@/lib/db"

export interface CreateIssueResponse {
  isError: boolean
  issue: IssueData | null
  error: {
    title: string
    description: string
  } | null
}

export const createProjectIssue = (
  projectKey: string,
  largestIssueIdx: number,
  projectId?: string,
  projectMemberId?: string
) => {
  const remainingIssueData = {
    projectId,
    reporterId: projectMemberId,
    issueKey: `${projectKey}-${largestIssueIdx + 1}`,
  }

  return async (issueData: IssueReqData): Promise<IssueData> => {
    const response = await fetch(`/api/projects/${projectId}/issues`, {
      method: "POST",
      body: JSON.stringify({
        ...issueData,
        ...remainingIssueData,
      }),
    })

    if (!response.ok) throw new Error("Failed to create issue")

    const data: CreateIssueResponse = await response.json()

    if (data.isError || data.issue == null) {
      throw new Error(JSON.stringify(data, null, 2))
    }

    return data.issue
  }
}

interface Params {
  params: {
    projectId: string
  }
}

export const GET = async (req: Request, { params: { projectId } }: Params) => {
  const issues = await prisma.issue.findMany({
    where: {
      projectId,
    },
    select: {
      assignee: true,
      assigneeId: true,
      comments: true,
      createdAt: true,
      description: true,
      id: true,
      issueKey: true,
      issueType: true,
      priority: true,
      projectId: true,
      reporter: true,
      reporterId: true,
      status: true,
      project: true,
      tags: true,
      title: true,
      updatedAt: true,
    },
  })

  return new Response(
    JSON.stringify({
      issues,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
      status: 200,
    }
  )
}

export async function DELETE(req: Request, { params: { projectId } }: Params) {
  // delete project
  await prisma.project
    .delete({
      where: {
        id: projectId,
      },
    })
    .catch((e) => {
      return new Response(
        JSON.stringify({
          isError: true,
          error: e ?? "Record to delete does not exist.",
        }),
        {
          status: 500,
        }
      )
    })

  return new Response(
    JSON.stringify({
      isError: false,
      error: null,
    }),
    {
      status: 200,
    }
  )
}

export const POST = async (req: Request, { params: { projectId } }: Params) => {
  const issueReqData: IssueReqData & {
    issueKey: string
    reporterId: string
  } = await req.json()

  const issueData = {
    ...issueReqData,
    projectId,
  }

  console.log("Issue data", issueData)

  // create issue
  const issue = (await prisma.issue.create({
    data: {
      ...issueData,
    },
    select: {
      comments: true,
      assignee: true,
      tags: true,
      reporter: true,
      assigneeId: true,
      description: true,
      id: true,
      issueKey: true,
      issueType: true,
      priority: true,
      projectId: true,
      reporterId: true,
      status: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  })) as IssueData

  if (!issue) {
    return new Response(
      JSON.stringify({
        isError: true,
        issue: null,
        error: {
          title: "Issue not found",
          description: "Issue not found",
        },
      } as CreateIssueResponse),
      {
        status: 404,
      }
    )
  }

  return new Response(
    JSON.stringify({
      isError: false,
      issue,
      error: null,
    } as CreateIssueResponse),
    {
      headers: {
        "content-type": "application/json",
      },
      status: 200,
    }
  )
}
