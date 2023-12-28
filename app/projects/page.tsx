"use client"

import Link from "next/link"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

import { buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Shell } from "@/components/shell"

import {
  ProjectWithFullLead,
  fetchProjectsWithLeads,
} from "../api/users/projects/route"
import ProjectsTable from "./projects-table"

export const ProjectsQueryOptions = queryOptions<ProjectWithFullLead[]>({
  queryKey: ["projectsWithLeads"],
  queryFn: fetchProjectsWithLeads,
  staleTime: 60000,
})

const ProjectsPage = async () => {
  const { data: session } = useSession()
  const { toast } = useToast()

  const { data, status, error } = useQuery(ProjectsQueryOptions)

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
        userId={session?.user?.id}
      />
    </Shell>
  )
}

export default ProjectsPage
