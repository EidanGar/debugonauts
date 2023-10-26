import { Comment } from "./comment"
import { IssueType, Priority, Status } from "./data"
import { User } from "./user"

export interface Issue {
  id: string
  title: string
  description: string
  status: Status
  createdAt: string
  updatedAt: string
  userId: string
  user: User
  projectId: string
  comments: Comment[]
  type: IssueType
  priority: Priority
}
