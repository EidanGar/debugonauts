import { User } from "@prisma/client"

import prisma from "@/lib/db"
import { ProfileData } from "@/app/manage-profile/profile"

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

  console.log("Found user:", foundUser)

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

  console.log("User exists")

  const updatedUserData = {
    ...foundUser,
    ...profileData,
  }

  console.log("Updated user data:", updatedUserData)

  const user: User = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updatedUserData as ProfileData,
  })

  console.log("Updated user:", user)

  return new Response(
    JSON.stringify({
      isError: false,
      user,
      error: null,
    })
  )
}
