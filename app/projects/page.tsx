"use client"

import Link from "next/link"
import { Project, User } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Shell } from "@/components/shell"

import ProjectsTable, { ProjectWithLead } from "./projects-table"

const fetchProjectsWithLeads = async () => {
  const projectsResponse = await fetch("/api/users/projects")

  // TODO3: Improve fetching efficiency
  if (!projectsResponse.ok) throw new Error("Failed to fetch projects")

  const projectsData = await projectsResponse.json()

  if (!projectsData.projects) throw new Error("Failed to fetch projects")

  const projectLeadsResponse = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      userIds: projectsData.projects.map((project: Project) => {
        return project.projectLeadId
      }),
    }),
  })

  if (!projectLeadsResponse.ok) throw new Error("Failed to fetch project leads")

  const projectLeadsData = await projectLeadsResponse.json()

  const projectLeadsMap: { [key: string]: User } = {}

  projectLeadsData.users.forEach((user: User) => {
    projectLeadsMap[user.id] = user
  })

  const projectsWithLeads = projectsData.projects.map((project: Project) => {
    const projectLead = projectLeadsMap[project.projectLeadId!]

    return {
      ...project,
      leadName: projectLead.name,
      leadImage: projectLead.image,
    }
  })

  return projectsWithLeads
}

const ProjectsPage = async () => {
  const { toast } = useToast()

  const { data, status, error } = useQuery<ProjectWithLead[]>({
    queryKey: ["projects"],
    queryFn: fetchProjectsWithLeads,
  })

  if (error) {
    toast({
      title: "Failed to fetch projects",
      description: "Please try again later",
    })
  }

  return (
    <Shell as="div" className="static flex flex-col items-center gap-5 py-4">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-medium leading-8 tracking-tighter md:text-4xl">
          Projects
        </h1>
        <Link href="/projects/new" className={buttonVariants({ size: "sm" })}>
          Create project
        </Link>
      </div>
      <ProjectsTable
        isLoading={status === "pending"}
        data={data as ProjectWithLead[]}
      />
    </Shell>
  )
}

export default ProjectsPage
