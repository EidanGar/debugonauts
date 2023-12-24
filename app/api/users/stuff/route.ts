import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

import prisma from "@/lib/db"

export const secret = process.env.SECRET

export const GET = async (req: NextApiRequest) => {
  const token = await getToken({ req, secret })

  console.log("Token:", token)

  const user = await prisma.user.findUnique({
    where: {
      id: token?.sub,
    },
  })

  if (!user) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  })
}
