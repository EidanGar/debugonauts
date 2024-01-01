import { IssueData, IssueReqData } from "@/prisma/zod/issues"

import prisma from "@/lib/db"

interface Params {
  params: {
    issueId: string
  }
}

export interface DeleteIssueResponse {
  isError: boolean
  issueId: string
  error: {
    title: string
    description: string
  } | null
}

export const deleteProjectIssue = async (issueId: string): Promise<string> => {
  const response = await fetch(`/api/issues/${issueId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    console.error("Failed to delete issue")
  }

  const data: DeleteIssueResponse = await response.json()

  if (data.isError || data.issueId == null) {
    throw new Error(JSON.stringify(data, null, 2))
  }

  return data.issueId
}

export interface UpdateIssueResponse {
  isError: boolean
  issue: IssueData | null
  error: {
    title: string
    description: string
  } | null
}

export const updateProjectIssue = async (
  issueData: IssueReqData
): Promise<IssueData> => {
  const response = await fetch(`/api/issues/${issueData.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(issueData),
  })

  if (!response.ok) throw new Error("Failed to update issue")

  const data: UpdateIssueResponse = await response.json()

  if (data.isError || data.issue == null) {
    throw new Error(JSON.stringify(data, null, 2))
  }

  return data.issue
}

export const DELETE = async (req: Request, { params: { issueId } }: Params) => {
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
        } as DeleteIssueResponse),
        {
          status: 500,
        }
      )
    })

  return new Response(
    JSON.stringify({
      isError: false,
      issueId,
      error: null,
    } as DeleteIssueResponse),
    {
      status: 200,
    }
  )
}

export const PATCH = async (req: Request, { params: { issueId } }: Params) => {
  // update issue
  const issueReqData: IssueReqData & {
    issueKey?: string
    reporterId?: string
  } = await req.json()

  console.log("Issue data", issueReqData)

  // update issue
  const issue = (await prisma.issue.update({
    where: {
      id: issueId,
    },
    data: {
      ...issueReqData,
    },
    select: {
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
      } as UpdateIssueResponse),
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
    } as UpdateIssueResponse),
    {
      headers: {
        "content-type": "application/json",
      },
      status: 200,
    }
  )
}
