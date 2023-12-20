"use client"

import { useEffect, useState } from "react"
import { Project } from "@prisma/client"
import { useSession } from "next-auth/react"

import { Shell } from "@/components/shell"
import Loading from "@/app/loading"

const ProjectPage = async ({
  params: { projectKey },
}: {
  params: { projectKey: string }
}) => {
  const { data: session } = useSession()
  const [projectData, setProjectData] = useState<Project | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      const projectRes = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectKey }),
      })

      const project = await projectRes.json()

      if (!project) {
        return
      }

      setProjectData(project)
    }

    fetchProject()
  }, [projectKey])

  if (!projectData) {
    return <Loading />
  }

  return (
    <Shell as="main" className="flex flex-col gap-5 py-4">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        {projectData.name}
      </h1>
      <pre className="p-4 rounded-md bg-primary-foreground">
        <code>{JSON.stringify({ projectData, session }, null, 2)}</code>
      </pre>
    </Shell>
  )
}

export default ProjectPage
