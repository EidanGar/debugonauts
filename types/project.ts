export interface Project {
  title: string
  description: string
  status: string
  createdAt: Date
  users: string[] // user ids
  issues: string[] // issue ids
  id: string
}
