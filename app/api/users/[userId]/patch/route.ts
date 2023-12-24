import { ProfileData } from "@/prisma/zod/profile"
import { User } from "@prisma/client"

import prisma from "@/lib/db"

export const PATCH = async (
  req: Request,
  {
    params: { userId },
  }: {
    params: { userId: string }
  }
) => {
  const profileData = (await req.json()) as ProfileData

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

  const updatedUserData = {
    ...foundUser,
    ...profileData,
  }

  const user: User = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updatedUserData as ProfileData,
  })

  return new Response(
    JSON.stringify({
      isError: false,
      user,
      error: null,
    })
  )
}
