import prisma from "@/lib/db"

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
