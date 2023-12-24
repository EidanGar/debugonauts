// import { cookies } from "next/headers"
"use client"

import { createContext, useEffect, useState } from "react"
import { Project } from "@prisma/client"
import type { Session } from "next-auth"
import { useSession } from "next-auth/react"

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

export default function ProjectLayout({
  children,
  params: { projectKey },
}: RootLayoutProps) {
  const { data: session } = useSession()
  const [projectData, setProjectData] = useState<Project | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      const projectRes = await fetch(`/api/projects/${projectKey}`)
      const project = await projectRes.json()
      if (!project) return

      setProjectData(project)
    }

    fetchProject()
  }, [projectKey])

  // const layout = cookies().get("react-resizable-panels:layout")
  // const collapsed = cookies().get("react-resizable-panels:collapsed")

  // const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  // const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

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
