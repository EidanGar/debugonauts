import { Comment } from "@prisma/client"

import prisma from "@/lib/db"

interface CreateCommentResponse {
  isError: boolean
  comment: Comment | null
  error: {
    title: string
    description: string
  } | null
}

export interface CommentReqData {
  content: string
  authorId: string
}

export const createCommentFn = async ({
  issueId,
  commentData,
}: {
  issueId: string
  commentData: CommentReqData
}) => {
  const response = await fetch(`/api/issues/${issueId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  })

  if (!response.ok) throw new Error("Failed to create comment")

  const data: CreateCommentResponse = await response.json()

  if (data.isError || data.comment == null) {
    throw new Error(JSON.stringify(data, null, 2))
  }

  return data.comment
}

interface Params {
  params: {
    issueId: string
  }
}

export const POST = async (req: Request, { params: { issueId } }: Params) => {
  const commentReqData: CommentReqData = await req.json()

  const commentData = {
    ...commentReqData,
    issueId,
  }

  const comment = (await prisma.comment.create({
    data: commentData,
  })) as Comment

  if (!comment) {
    return new Response(
      JSON.stringify({
        isError: true,
        error: {
          title: "Failed to create comment",
          description: "Failed to create comment",
        },
        comment: null,
      } as CreateCommentResponse),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  return new Response(
    JSON.stringify({
      isError: false,
      error: null,
      comment,
    } as CreateCommentResponse),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}
