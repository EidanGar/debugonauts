import prisma from "@/lib/db"

export async function POST(req: Request) {
  const { projectId } = (await req.json()) as { projectId: string }

  const foundProject = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  })

  if (!foundProject) {
    return new Response(
      JSON.stringify({
        isError: true,
        error: {
          title: "Project not found",
          description: "This project does not exist",
        },
      }),
      {
        status: 404,
      }
    )
  }

  // delete project
  await prisma.project.delete({
    where: {
      id: projectId,
    },
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
