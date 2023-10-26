import { Shell } from "@/components/shell"

const ProjectPage = ({
  params: { project },
}: {
  params: { project: string }
}) => {
  return (
    <Shell>
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        {project}
      </h1>
    </Shell>
  )
}

export default ProjectPage
