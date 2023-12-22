"use client"

import type {
  Comment,
  Issue,
  Notification,
  Project,
  User,
} from "@prisma/client"
import { useSession } from "next-auth/react"

import { UserFetchResponse } from "@/app/api/users/email/route"

export interface UserData extends User {
  projects: Project[]
  issues: Issue[]
  notifications: Notification[]
  comments: Comment[]
}

const useAuth = async () => {
  const { data: session, status, update } = useSession()

  const fetchUserInfo = async () => {
    if (!session || !session.user || !session.user.email) return null
    console.time("fetchUserInfo")

    const userRes = await fetch(`/api/users/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session.user.email,
      }),
    })

    const { isError, user } = (await userRes.json()) as UserFetchResponse

    if (isError || !user) {
      console.error("Error fetching user info", user)
      return null
    }

    // get user projects
    const projects = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
      }),
    })

    user.projects = (await projects.json()).projects as Project[]

    session.user = {
      ...{
        ...user,
        hashedPwd: undefined,
        salt: undefined,
      },
    }

    console.timeEnd("fetchUserInfo")

    return { session, status, update }
  }

  return fetchUserInfo()
}

export default useAuth
