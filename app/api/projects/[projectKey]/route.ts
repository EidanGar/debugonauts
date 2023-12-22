import prisma from "@/lib/db"

export async function GET(
  req: Request,
  { params: { projectKey } }: { params: { projectKey: string } }
) {
  const project = await prisma.project.findUnique({
    where: {
      projectKey,
    },
    select: {
      members: true,
      name: true,
      description: true,
      repository: true,
      tags: true,
      visibility: true,
      projectKey: true,
      createdAt: true,
      updatedAt: true,
      id: true,
      issues: true,
      projectLead: true,
      projectLeadId: true,
      teams: true,
      User: true,
      userId: true,
    },
  })

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
      project,
      error: null,
    }),
    {
      status: 200,
    }
  )
}
