import prisma from "@/lib/db"

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
