import { Role } from "./data"
import { Issue } from "./issue"

export interface User {
  username: string
  password?: string
  provider: string
  email: string
  id: string
  issues: Issue[]
  role?: Role
  profileImageUrl?: string
}
