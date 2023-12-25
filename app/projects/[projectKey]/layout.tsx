// import { cookies } from "next/headers"
"use client"

import { createContext } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Session } from "next-auth"
import { useSession } from "next-auth/react"

import { useToast } from "@/components/ui/use-toast"
import { FullProject } from "@/app/api/projects/key/[projectKey]/route"

import ProjectSideBar from "./project-sidebar"

interface ProjectLayoutProps {
  children: React.ReactNode
  params: { projectKey: string }
}

export interface ProjectAndSession {
  projectData: FullProject | null
  session: Session | null
}

export const ProjectContext = createContext<ProjectAndSession>({
  projectData: null,
  session: null,
})

const fetchProject = async (projectKey: string) => {
  const projectRes = await fetch(`/api/projects/key/${projectKey}`)
  if (!projectRes.ok) throw new Error("Failed to fetch project")
  const projectData = await projectRes.json()
  return projectData.project
}

export default function ProjectLayout({
  children,
  params: { projectKey },
}: ProjectLayoutProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const { data: projectData, error } = useQuery<FullProject>({
    queryKey: ["project", projectKey],
    queryFn: () => fetchProject(projectKey),
    enabled: !!projectKey,
  })

  if (error) {
    // toast({
    //   title: error.name,
    //   description: error.message,
    // })
    console.error(error.message)
  }

  return (
    <ProjectContext.Provider
      value={{ projectData: projectData ?? null, session }}
    >
      <main className="w-full">
        <ProjectSideBar projectKey={projectKey} navCollapsedSize={4}>
          {children}
        </ProjectSideBar>
      </main>
    </ProjectContext.Provider>
  )
}
