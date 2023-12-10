import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcryptjs from "bcryptjs"
import { getServerSession, type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import prisma from "@/lib/db"

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
        console.log("Authenticating with credentials", credentials)
        if (!credentials) {
          throw new Error("No credentials provided")
        }

        const { email, password } = credentials

        console.log("Fetching user from database")
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (!user) return null

        console.log("Checking password")
        const passwordMatch = await bcryptjs.compare(
          password + user.salt,
          user.hashedPwd
        )

        if (!passwordMatch) return null

        console.log("Returning user", user)
        return user
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      console.log("session callback", { session, user })
      return Promise.resolve(session)
    },
  },
  secret: process.env.SECRET,
  pages: {
    signIn: "/auth/signin",
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
