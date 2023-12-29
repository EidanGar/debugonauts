"use client"

import { useContext, useState } from "react"
import { useSearchParams } from "next/navigation"
import { IssueData } from "@/prisma/zod/issues"
import { IssueStatus } from "@prisma/client"
import { UseMutateFunction } from "@tanstack/react-query"

import { capitalize } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import BreadCrumbs from "@/components/breadcrumbs"
import Loading from "@/app/loading"

import Board from "./board"
import CurrentIssue from "./edit-issue"
import { ProjectContext, ProjectContextData } from "./layout"

const ProjectPage = async ({
  params: { projectKey },
}: {
  params: { projectKey: string }
}) => {
  const { toast } = useToast()
  const { projectData, session, issueHandlers } =
    useContext<ProjectContextData>(ProjectContext)

  const selectedIssueKey = useSearchParams().get("selectedIssue")
  const selectedIssue = projectData?.issues.find(
    (issue) => issue.issueKey === selectedIssueKey
  )
  const [isIssueSheetOpen, setIsIssueSheetOpen] = useState(!!selectedIssue)

  const projectUsers = projectData?.members

  if (!projectData) {
    return <Loading />
  }

  const issuesByStatus = {
    [IssueStatus.TO_DO]: projectData.issues.filter(
      (issue) => issue.status === IssueStatus.TO_DO
    ),
    [IssueStatus.IN_PROGRESS]: projectData.issues.filter(
      (issue) => issue.status === IssueStatus.IN_PROGRESS
    ),
    [IssueStatus.DONE]: projectData.issues.filter(
      (issue) => issue.status === IssueStatus.DONE
    ),
  }

  return (
    <main className="flex flex-col w-full gap-5">
      <BreadCrumbs />
      <h1 className="text-2xl font-medium leading-8 tracking-tighter md:text-4xl">
        {projectKey.slice(0, 3)} board
      </h1>
      <CurrentIssue
        deleteIssue={issueHandlers.deleteIssueMutation.mutate}
        selectedIssue={selectedIssue}
        projectUsers={projectData?.members}
        isIssueSheetOpen={isIssueSheetOpen}
        setIsIssueSheetOpen={setIsIssueSheetOpen}
        updateIssue={
          issueHandlers.updateIssue as UseMutateFunction<
            any,
            Error,
            IssueData,
            unknown
          >
        }
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
        {Object.entries(issuesByStatus).map(([status, issues]) => (
          <Board
            issues={issues}
            boardTitle={capitalize(status.split("_").join(" "))}
            projectUsers={projectUsers}
            boardIssueStatusType={status as IssueStatus}
            issueHandlers={issueHandlers}
            setIsIssueSheetOpen={setIsIssueSheetOpen}
          />
        ))}
      </div>
    </main>
  )
}

export default ProjectPage
