import { IssueData } from "@/prisma/zod/issues"

import prisma from "@/lib/db"

interface Params {
  params: {
    projectId: string
  }
}

export const updateProjectIssue = async (issueData: IssueData) => {
  const response = await fetch(`/api/issues/${issueData.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(issueData),
  })

  if (!response.ok) throw new Error("Failed to update issue")
  const data = await response.json()
  return data
}

export const DELETE = async (
  req: Request,
  {
    params: { issueId },
  }: {
    params: {
      issueId: string
    }
  }
) => {
  // delete issue
  await prisma.issue
    .delete({
      where: {
        id: issueId,
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

export const PATCH = async (
  req: Request,
  {
    params: { issueId },
  }: {
    params: {
      issueId: string
    }
  }
) => {
  // update issue
  const issueReqData: IssueData & {
    issueKey?: string
    reporterId?: string
  } = await req.json()

  console.log("Issue data", issueReqData)

  // update issue
  const issue = await prisma.issue.update({
    where: {
      id: issueId,
    },
    data: {
      ...issueReqData,
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
