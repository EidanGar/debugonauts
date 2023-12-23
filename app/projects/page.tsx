"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Project, User } from "@prisma/client"
import { useSession } from "next-auth/react"

import { buttonVariants } from "@/components/ui/button"
import { Shell } from "@/components/shell"

import ProjectsTable, { ProjectWithLead } from "./projects-table"

const ProjectsPage = async () => {
  const [userProjects, setUserProjects] = useState<ProjectWithLead[] | null>(
    null
  )
  const { data: session } = useSession()

  useEffect(() => {
    const fetchProjectsWithLeads = async () => {
      const projectsResponse = await fetch(
        // @ts-ignore
        `/api/users/${session?.user?.id}/projects`
      )

      // TODO: Fix projects fetch fail error from projects page
      // TODO2: Add error toast and improve error handling
      // TODO3: Improve fetching efficiency
      console.log("Projects response:", projectsResponse)

      if (!projectsResponse.ok) throw new Error("Failed to fetch projects")

      const projectsData = await projectsResponse.json()

      const projectLeadsResponse = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          userIds: projectsData.projects.map((project: Project) => {
            return project.projectLeadId
          }),
        }),
      })

      if (!projectLeadsResponse.ok)
        throw new Error("Failed to fetch project leads")

      const projectLeadsData = await projectLeadsResponse.json()

      const projectLeadsMap: { [key: string]: User } = {}

      projectLeadsData.users.forEach((user: User) => {
        projectLeadsMap[user.id] = user
      })

      const projectsWithLeads = projectsData.projects.map(
        (project: Project) => {
          const projectLead = projectLeadsMap[project.projectLeadId!]

          return {
            ...project,
            leadName: projectLead.name,
            leadImage: projectLead.image,
          }
        }
      )

      setUserProjects(projectsWithLeads as ProjectWithLead[])
    }

    if (session && userProjects == null) fetchProjectsWithLeads()
  }, [session, userProjects?.length, userProjects])

  return (
    <Shell as="div" className="static flex flex-col items-center gap-5 py-4">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-medium leading-8 tracking-tighter md:text-4xl">
          Projects
        </h1>
        <Link href="/projects/new" className={buttonVariants({ size: "sm" })}>
          Create project
        </Link>
        {/* TODO: Create a useAuth hook that wraps around the useSession hook and provides the full user */}
      </div>
      <ProjectsTable data={userProjects} />
    </Shell>
  )
}

export default ProjectsPage
