import { Issue } from "./issue"
import { User } from "./user"

export interface Project {
  title: string
  description: string
  status: string
  createdAt?: string
  updatedAt?: string
  users: User[]
  issues: Issue[]
  id: string
}
