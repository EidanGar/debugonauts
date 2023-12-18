import { Project, Visibility } from "@prisma/client"
import { z } from "zod"

export const newProjectSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "The project name must be at least 3 characters in length.",
    })
    .max(50, {
      message: "The project name must not exceed 50 characters in length.",
    }),
  description: z
    .string()
    .min(3, {
      message:
        "The project description must be at least 3 characters in length.",
    })
    .max(500, {
      message:
        "The project description must not exceed 500 characters in length.",
    })
    .optional(),
  repository: z.coerce
    .string()
    .max(100, {
      message: "The repository URL must not exceed 100 characters in length.",
    })
    .optional(),
  tags: z.array(z.string()),
  visibility: z
    .enum([Visibility.PUBLIC, Visibility.PRIVATE])
    .default(Visibility.PRIVATE),
  projectKey: z
    .string()
    .min(2, {
      message:
        "Project keys must start with an uppercase letter, followed by one or more uppercase alphanumeric characters.",
    })
    .max(10, {
      message: "The project key must not exceed 10 characters in length.",
    })
    .regex(/^[A-Z][A-Z0-9]+$/),
})

export type NewProjectData = z.infer<typeof newProjectSchema>

export type CreateProjectRequest = {
  projectLeadId: string
} & NewProjectData

export interface CreateProjectResponse {
  isError: boolean
  project: Project | null
  error: {
    title: string
    description: string
  } | null
}
