"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import { buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Shell } from "@/components/shell"

import {
  ProjectWithFullLead,
  ProjectsFetchData,
} from "../api/users/projects/route"
import ProjectsTable from "./projects-table"

const fetchProjectsWithLeads = async () => {
  const projectsWithLeadsResponse = await fetch("/api/users/projects")

  if (!projectsWithLeadsResponse.ok) throw new Error("Failed to fetch projects")

  const { projectsWithLeads }: ProjectsFetchData =
    await projectsWithLeadsResponse.json()

  if (!projectsWithLeads) throw new Error("Failed to fetch projects")

  return projectsWithLeads
}

const ProjectsPage = async () => {
  const { toast } = useToast()

  const { data, status, error } = useQuery<ProjectWithFullLead[]>({
    queryKey: ["projectsWithLeads"],
    queryFn: fetchProjectsWithLeads,
    staleTime: 60000,
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
        data={data as ProjectWithFullLead[]}
      />
    </Shell>
  )
}

export default ProjectsPage
