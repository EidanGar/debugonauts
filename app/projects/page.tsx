"use client"

import Link from "next/link"
import { Project } from "@prisma/client"

import { buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import ProjectCard from "@/components/project"
import { Shell } from "@/components/shell"

const ProjectsPage = async () => {
  const fetchUserProjects = async () => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id,
      }),
    })

    // if (!res.ok) {
    //   toast({
    //     title: "Something went wrong",
    //     description: "Please try again",
    //   })
    //   return
    // }

    const response = await res.json()

    // if (res.status !== 200) {
    //   toast(response.error)
    //   return
    // }

    return response.projects
  }

  const userProjects = await fetchUserProjects()

  return (
    <Shell className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Projects
        </h1>
        <Link href="/projects/new" className={buttonVariants({ size: "sm" })}>
          Create project
        </Link>
      </div>
      <Shell variant="grid">
        {userProjects.map((project: Project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </Shell>
    </Shell>
  )
}

export default ProjectsPage
