import { Account } from "@prisma/client"

import prisma from "@/lib/db"

export interface FetchAccountResponse {
  error: {
    title: string
    description: string
  } | null
  isError: boolean
  account: Account | null
}

export const GET = async (
  req: Request,
  { params: { email } }: { params: { email: string } }
) => {
  const founderUser = await prisma.user.findUnique({
    where: {
      email: decodeURIComponent(email),
    },
  })

  if (!founderUser) {
    return new Response(
      JSON.stringify({
        error: "User not found",
        isError: true,
        account: null,
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  const userAccount = await prisma.account.findUnique({
    where: {
      userId: founderUser.id,
    },
  })

  if (!userAccount) {
    return new Response(
      JSON.stringify({
        error: "User account not found",
        isError: true,
        account: null,
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  return new Response(
    JSON.stringify({
      error: null,
      isError: false,
      account: userAccount,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export const PATCH = async (
  req: Request,
  { params: { email } }: { params: { email: string } }
) => {
  const accountData = (await req.json()) as Partial<Account>

  const founderUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!founderUser) {
    return new Response(
      JSON.stringify({
        error: "User not found",
        isError: true,
        account: null,
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  const userAccount = await prisma.account.update({
    where: {
      userId: founderUser.id,
    },
    data: {
      ...accountData,
    },
  })

  return new Response(
    JSON.stringify({
      error: null,
      isError: false,
      account: userAccount,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}
