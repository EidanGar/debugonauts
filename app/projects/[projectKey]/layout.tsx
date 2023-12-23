// import { cookies } from "next/headers"
"use client"

import ProjectSideBar from "./project-sidebar"

interface RootLayoutProps {
  children: React.ReactNode
  params: { projectKey: string }
}

export default function ProjectLayout({
  children,
  params: { projectKey },
}: RootLayoutProps) {
  // const layout = cookies().get("react-resizable-panels:layout")
  // const collapsed = cookies().get("react-resizable-panels:collapsed")

  // const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  // const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  return (
    <main className="w-screen min-h-screen">
      <ProjectSideBar projectKey={projectKey} navCollapsedSize={4}>
        {children}
      </ProjectSideBar>
    </main>
  )
}
