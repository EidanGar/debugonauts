import prisma from "@/lib/db"

export const DELETE = async (req: Request) => {
  const { userId } = await req.json()

  const foundUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!foundUser) {
    return new Response(
      JSON.stringify({
        isError: true,
        user: null,
        error: {
          title: "User not found",
          description: "This user does not exist",
        },
      }),
      {
        status: 404,
      }
    )
  }

  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
  })

  return new Response(
    JSON.stringify({
      isError: false,
      user,
      error: null,
    })
  )
}
