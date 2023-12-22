import prisma from "@/lib/db"

export async function GET(
  req: Request,
  {
    params: { userId },
  }: {
    params: { userId: string }
  }
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    return new Response(
      JSON.stringify({
        isError: true,
        user: null,
        error: {
          title: "User not found",
          description: "The user you are trying to fetch does not exist.",
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
      user,
      error: null,
    }),
    {
      status: 200,
    }
  )
}
