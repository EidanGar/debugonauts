import prisma from "@/lib/db"

interface Params {
  params: {
    projectKey: string
  }
}

export async function DELETE(req: Request, { params: { projectKey } }: Params) {
  // delete project
  await prisma.project
    .delete({
      where: {
        projectKey,
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
