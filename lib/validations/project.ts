import { Project, Visibility } from "@prisma/client"
import { z } from "zod"

export enum Labels {
  FEATURE = "FEATURE",
  BUG = "BUG",
  ENCHANCEMENT = "ENCHANCEMENT",
  DOCUMENTATION = "DOCUMENTATION",
  DESIGN = "DESIGN",
  QUESTION = "QUESTION",
  MAINTAINANCE = "MAINTAINANCE",
}

export const newProjectSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(3).max(500),
  repository: z.string().url().optional(),
  tags: z.array(z.string()),
  visibility: z
    .enum([Visibility.PUBLIC, Visibility.PRIVATE])
    .default(Visibility.PRIVATE),
})

export type NewProjectData = z.infer<typeof newProjectSchema>

export type CreateProjectRequest = {
  ownerId: string
} & NewProjectData

export interface CreateProjectResponse {
  isError: boolean
  project: Project | null
  error: {
    title: string
    description: string
  } | null
}
