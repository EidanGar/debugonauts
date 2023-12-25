"use client"

import { useContext } from "react"
import { IssueStatus } from "@prisma/client"

import BreadCrumbs from "@/components/breadcrumbs"
import { Shell } from "@/components/shell"
import Loading from "@/app/loading"

import Board from "./board"
import { ProjectAndSession, ProjectContext } from "./layout"

const ProjectPage = async ({
  params: { projectKey },
}: {
  params: { projectKey: string }
}) => {
  const { projectData, session } = useContext<ProjectAndSession>(ProjectContext)

  if (!projectData) {
    return <Loading />
  }

  const { issues } = projectData
  const issuesByStatus = {
    [IssueStatus.OPEN]: issues.filter(
      (issue) => issue.status === IssueStatus.OPEN
    ),
    [IssueStatus.IN_PROGRESS]: issues.filter(
      (issue) => issue.status === IssueStatus.IN_PROGRESS
    ),
    [IssueStatus.DONE]: issues.filter(
      (issue) => issue.status === IssueStatus.DONE
    ),
  }

  return (
    <Shell as="main" className="flex flex-col gap-5 py-4">
      <BreadCrumbs />
      <h1 className="text-2xl font-medium leading-8 tracking-tighter md:text-4xl">
        {projectKey.slice(0, 3)} board
      </h1>
      <div className="flex flex-col items-center w-full gap-3 sm:items-start sm:flex-row">
        <Board
          issues={issuesByStatus[IssueStatus.IN_PROGRESS]}
          boardTitle="To do"
          boardType={IssueStatus.IN_PROGRESS}
        />
        <Board
          issues={issuesByStatus[IssueStatus.OPEN]}
          boardTitle="In progress"
          boardType={IssueStatus.OPEN}
        />
        <Board
          issues={issuesByStatus[IssueStatus.DONE]}
          boardTitle="Done"
          boardType={IssueStatus.DONE}
        />
      </div>
    </Shell>
  )
}

export default ProjectPage
