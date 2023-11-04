import { NotificationType } from "./data"

export interface Notification {
  id: string
  content: string
  createdAt: Date
  userId: string
  targetLink?: string
  isRead: boolean
  projectId: string
  type: NotificationType
}
