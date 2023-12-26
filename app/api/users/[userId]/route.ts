import { NextRequest } from "next/server"
import { Account, User } from "@prisma/client"
import { getToken } from "next-auth/jwt"

import prisma from "@/lib/db"

export const setUserAccountPatch = (userId?: string) => {
  return async (userAccount: UserAccount) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userAccount),
    })

    if (!res.ok) {
      throw new Error("Something went wrong while setting your account")
    }

    const data: UserAccountResponse = await res.json()

    if (data.isError) throw new Error(data.error?.title)

    return data.userAccount
  }
}

export const getUserAccount = async (userId: string) => {
  const res = await fetch(`/api/users/${userId}`)

  if (!res.ok)
    throw new Error("Something went wrong while getting your account")

  const data: UserAccountResponse = await res.json()

  if (data.isError || !data.userAccount) throw new Error(data.error?.title)

  return data.userAccount
}

type UserPatchData = Partial<Omit<User, "hashedPwd" | "salt" | "accountId">> & {
  accountId: string | null
}

export interface UserAccount extends UserPatchData {
  account: Partial<Account> | null
}

export interface UserAccountResponse {
  isError: boolean
  userAccount: UserAccount | null
  error: {
    title: string
    description: string
  } | null
}

const secret = process.env.SECRET!

const selectableUserWithAccount = {
  id: true,
  name: true,
  image: true,
  bannerImage: true,
  email: true,
  emailVisibility: true,
  bio: true,
  jobTitle: true,
  account: true,
  accountId: true,
  department: true,
  organization: true,
  location: true,
  locationVisibility: true,
  timezone: true,
  createdAt: true,
  updatedAt: true,
  hashedPwd: false,
  salt: false,
}

export async function GET(
  req: NextRequest,
  {
    params: { userId },
  }: {
    params: { userId: string }
  }
) {
  const userAccount: UserAccount | null = await prisma.user.findUnique({
    where: {
      id: userId || (await getToken({ req, secret }))?.sub,
    },
    select: selectableUserWithAccount,
  })

  if (!userAccount) {
    return new Response(
      JSON.stringify({
        isError: true,
        userAccount: null,
        error: {
          title: "User not found",
          description: "The user you are trying to fetch does not exist.",
        },
      } as UserAccountResponse),
      {
        status: 404,
      }
    )
  }

  return new Response(
    JSON.stringify({
      isError: false,
      userAccount,
      error: null,
    }),
    {
      status: 200,
    }
  )
}

export const PATCH = async (
  req: Request,
  {
    params: { userId },
  }: {
    params: { userId: string }
  }
) => {
  const profileData = (await req.json()) as UserAccount
  const { account: accountData, accountId, ...userDAta } = profileData

  const userAccount: UserAccount = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...userDAta,
      account: {
        update: {
          data: accountData as Account,
        },
      },
    },
    select: selectableUserWithAccount,
  })

  return new Response(
    JSON.stringify({
      isError: false,
      userAccount,
      error: null,
    } as UserAccountResponse)
  )
}

export const DELETE = async (
  req: Request,
  {
    params: { userId },
  }: {
    params: { userId: string }
  }
) => {
  const user = await prisma.user
    .delete({
      where: {
        id: userId,
      },
    })
    .catch((err) => {
      return new Response(
        JSON.stringify({
          isError: true,
          user: null,
          error: {
            title: err instanceof Error ? err.cause : "User not found",
            description:
              err instanceof Error ? err.message : "This user does not exist",
          },
        }),
        {
          status: 404,
        }
      )
    })

  return new Response(
    JSON.stringify({
      isError: false,
      user,
      error: null,
    })
  )
}
