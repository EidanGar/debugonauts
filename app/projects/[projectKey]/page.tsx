"use client"

import { useContext } from "react"

import { Shell } from "@/components/shell"
import Loading from "@/app/loading"

import { ProjectAndSession, ProjectContext } from "./layout"

const ProjectPage = async ({
  params: { projectKey },
}: {
  params: { projectKey: string }
}) => {
  const { projectData, session } = useContext<ProjectAndSession>(ProjectContext)

  if (!projectData || !session) {
    return <Loading />
  }

  return (
    <Shell as="main" className="flex flex-col gap-5 py-4">
      <h1 className="text-2xl font-medium leading-8 tracking-tighter md:text-4xl">
        {projectKey.slice(0, 3)} board
      </h1>
      <pre className="p-4 rounded-md bg-primary-foreground">
        <code>{JSON.stringify({ projectData, session }, null, 2)}</code>
      </pre>
    </Shell>
  )
}

export default ProjectPage
