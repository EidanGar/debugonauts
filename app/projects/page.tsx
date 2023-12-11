"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Project } from "@prisma/client"
import { useSession } from "next-auth/react"

import { buttonVariants } from "@/components/ui/button"
import ProjectCard from "@/components/project"
import { Shell } from "@/components/shell"

import Loading from "../loading"

const ProjectsPage = async () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) router.push("/")

  return (
    <Shell as="div" className="static flex flex-col items-center py-4 gap-7">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Projects
        </h1>
        <Link href="/projects/new" className={buttonVariants({ size: "sm" })}>
          Create project
        </Link>
      </div>
      {/* TODO: Fix all ts ignores related to the user session type */}
      {/* @ts-ignore */}
      {session?.user?.projects?.length ? (
        <Shell variant="grid">
          {/* @ts-ignore */}
          {session?.user?.projects.map((project: Project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </Shell>
      ) : (
        <Loading />
      )}
    </Shell>
  )
}

export default ProjectsPage
