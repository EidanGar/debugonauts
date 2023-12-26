"use client"

import { useContext } from "react"
import { IssueStatus } from "@prisma/client"

import BreadCrumbs from "@/components/breadcrumbs"
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
    [IssueStatus.TO_DO]: issues.filter(
      (issue) => issue.status === IssueStatus.TO_DO
    ),
    [IssueStatus.IN_PROGRESS]: issues.filter(
      (issue) => issue.status === IssueStatus.IN_PROGRESS
    ),
    [IssueStatus.DONE]: issues.filter(
      (issue) => issue.status === IssueStatus.DONE
    ),
  }

  return (
    <main className="flex flex-col w-full gap-5">
      <BreadCrumbs />
      <h1 className="text-2xl font-medium leading-8 tracking-tighter md:text-4xl">
        {projectKey.slice(0, 3)} board
      </h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
        <Board
          issues={issuesByStatus[IssueStatus.TO_DO]}
          boardTitle="In progress"
          boardType={IssueStatus.TO_DO}
        />
        <Board
          issues={issuesByStatus[IssueStatus.IN_PROGRESS]}
          boardTitle="To do"
          boardType={IssueStatus.IN_PROGRESS}
        />
        <Board
          issues={issuesByStatus[IssueStatus.DONE]}
          boardTitle="Done"
          boardType={IssueStatus.DONE}
        />
      </div>
    </main>
  )
}

export default ProjectPage
