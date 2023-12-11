import { Issue, Notification, Project, User } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: Omit<User, "hashedPwd" | "salt"> &
      DefaultSession["user"] & {
        projects: Project[]
        notifications: Notification[]
        issues: Issue[]
      }
  }
}
