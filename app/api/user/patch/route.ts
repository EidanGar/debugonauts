import prisma from "@/lib/db"
import { ProfileData } from "@/app/manage-profile/profile"

export const PATCH = async (req: Request) => {
  const profileData = (await req.json()) as ProfileData

  console.log(profileData)

  const foundUser = await prisma.user.findUnique({
    where: {
      email: profileData.email,
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

  const user = await prisma.user.update({
    where: {
      email: profileData.email,
    },
    data: {
      ...foundUser,
      ...profileData,
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
