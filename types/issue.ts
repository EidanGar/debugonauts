import { IssueType, Priority, Status } from "./data"

export interface Issue {
  id: string
  title: string
  description: string
  status: Status
  createdAt: Date
  reporterId: string
  projectId: string
  comments: string[]
  type: IssueType
  priority: Priority
  assigneeId?: string
  dueDate?: Date
  closedAt?: Date
  resolvedAt?: Date
}
