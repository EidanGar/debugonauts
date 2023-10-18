import Link from "next/link"

import { Project } from "@/types/project"
import { buttonVariants } from "@/components/ui/button"
import ProjectCard from "@/components/project"
import { Shell } from "@/components/shell"

const projects: Project[] = [
  {
    title: "Next.js",
    description:
      "Next.js is a popular open-source framework for building server-side rendered React applications. It provides a streamlined development experience with features like automatic code splitting, server-side rendering, and static site generation.",
  },
  {
    title: "Vercel",
    description:
      "Vercel is a cloud platform for static sites and serverless functions. It provides a seamless developer experience with features like automatic deployments, custom domains, and built-in analytics.",
  },
  {
    title: "SWR",
    description:
      "SWR is a React hook for data fetching. It provides a simple and efficient way to fetch data from APIs and cache the results. SWR is used by many developers to build fast and responsive web applications.",
  },
  {
    title: "Next.js Commerce",
    description:
      "Next.js Commerce is an open-source e-commerce platform built on top of Next.js. It provides a customizable and extensible framework for building online stores.",
  },
]

const ProjectsPage = ({
  params: { username },
}: {
  params: { username: string }
}) => {
  return (
    <Shell className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Projects
        </h1>
        <Link
          href={`/${username}/projects/new`}
          className={buttonVariants({ size: "sm" })}
        >
          Create project
        </Link>
      </div>
      <Shell variant="grid">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...{ ...project, username }} />
        ))}
      </Shell>
    </Shell>
  )
}

export default ProjectsPage
