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

export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export const newProjectSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(3).max(500),
  repository: z.string().url().optional(),
  tags: z.array(z.string()),
  visibility: z.enum(Object.values(Visibility) as [string, ...string[]]),
})

export type NewProjectData = z.infer<typeof newProjectSchema>
