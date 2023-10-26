import { NotificationType } from "./data"

export interface Notification {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
  link: string
  isRead: boolean
  projectId: string
  type: NotificationType
}
