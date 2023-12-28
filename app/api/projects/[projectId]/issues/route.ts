import { IssueData } from "@/prisma/zod/issues"

import prisma from "@/lib/db"

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

  return async (issueData: IssueData) => {
    const response = await fetch(`/api/projects/${projectId}/issues`, {
      method: "POST",
      body: JSON.stringify({
        ...issueData,
        ...remainingIssueData,
      }),
    })

    if (!response.ok) throw new Error("Failed to create issue")
    const data = await response.json()
    return data
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
  const issueReqData: IssueData & {
    issueKey: string
    reporterId: string
  } = await req.json()

  const issueData = {
    ...issueReqData,
    projectId,
  }

  console.log("Issue data", issueData)

  // create issue
  const issue = await prisma.issue.create({
    data: {
      ...issueData,
    },
  })

  console.log("Issue", issue)

  if (!issue) {
    return new Response(
      JSON.stringify({
        isError: true,
        issue: null,
        error: {
          title: "Issue not found",
          description: "Issue not found",
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
      issue,
      error: null,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
      status: 200,
    }
  )
}
