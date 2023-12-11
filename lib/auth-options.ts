import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { getServerSession, type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import prisma from "@/lib/db"
import { SignInResponse, UserSignInData } from "@/app/auth/signin/signin"

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "placeholder@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials as UserSignInData),
        })

        if (!res.ok) return null

        const data: SignInResponse | null = await res.json()

        if (!data || data.error) return null

        return data.user
      },
    }),
  ],
  callbacks: {
    session: async ({ session }) => {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" },
      })

      if (!user) return Promise.resolve(session)

      // get user projects
      const projects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      })

      // get user issues
      const issues = await prisma.issue.findMany({
        where: {
          assigneeId: user.id,
        },
      })

      // get user notifications
      const notifications = await prisma.notification.findMany({
        where: {
          recipientId: user.id,
        },
      })

      session.user = {
        ...session.user,
        ...{
          ...user,
          hashedPwd: undefined,
          salt: undefined,
          projects,
          issues,
          notifications,
        },
      }
      return Promise.resolve(session)
    },
  },
  secret: process.env.SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthOptions

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authConfig)
}
