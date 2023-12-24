// import { cookies } from "next/headers"
"use client"

import { createContext } from "react"
import { Project } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import type { Session } from "next-auth"
import { useSession } from "next-auth/react"

import { useToast } from "@/components/ui/use-toast"

import ProjectSideBar from "./project-sidebar"

interface RootLayoutProps {
  children: React.ReactNode
  params: { projectKey: string }
}

export interface ProjectAndSession {
  projectData: Project | null
  session: Session | null
}

export const ProjectContext = createContext<ProjectAndSession>({
  projectData: null,
  session: null,
})

const fetchProject = async (projectKey: string) => {
  const projectRes = await fetch(`/api/projects/${projectKey}`)
  if (!projectRes.ok) throw new Error("Failed to fetch project")
  const project = await projectRes.json()
  return project
}

export default function ProjectLayout({
  children,
  params: { projectKey },
}: RootLayoutProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const { data: projectData, error } = useQuery({
    queryKey: ["project", projectKey],
    queryFn: () => fetchProject(projectKey),
  })

  if (error) {
    toast({
      title: error.name,
      description: error.message,
    })
  }

  return (
    <ProjectContext.Provider value={{ projectData, session }}>
      <main className="w-full">
        <ProjectSideBar projectKey={projectKey} navCollapsedSize={4}>
          {children}
        </ProjectSideBar>
      </main>
    </ProjectContext.Provider>
  )
}
