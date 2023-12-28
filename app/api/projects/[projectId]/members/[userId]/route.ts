import prisma from "@/lib/db"

interface DeleteProjectMemberParams {
  params: {
    projectId: string
    userId: string
  }
}

// deletes a member from a project
export const DELETE = async (
  req: Request,
  { params: { userId, projectId } }: DeleteProjectMemberParams
) => {
  await prisma.projectMember
    .delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    })
    .catch((err) => {
      return new Response(
        JSON.stringify({
          isError: true,
          error: {
            title: "Failed to delete project member",
            message: err.message,
          },
        }),
        {
          status: 500,
        }
      )
    })

  await prisma.teamMember
    .deleteMany({
      where: {
        userId,
        team: {
          projectId,
        },
      },
    })
    .catch((err) => {
      return new Response(
        JSON.stringify({
          isError: true,
          error: {
            title: "Failed to delete team member",
            message: err.message,
          },
        }),
        {
          status: 500,
        }
      )
    })
}
