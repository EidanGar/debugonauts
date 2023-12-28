"use client"

import { useContext } from "react"
import { useSearchParams } from "next/navigation"
import { IssueData } from "@/prisma/zod/issues"
import { Issue, IssueStatus } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"

import { useToast } from "@/components/ui/use-toast"
import BreadCrumbs from "@/components/breadcrumbs"
import Loading from "@/app/loading"

import Board from "./board"
import { ProjectAndSession, ProjectContext } from "./layout"
import CurrentIssue from "./project-issue"

const ProjectPage = async ({
  params: { projectKey },
}: {
  params: { projectKey: string }
}) => {
  const { toast } = useToast()
  const { projectData, session } = useContext<ProjectAndSession>(ProjectContext)
  const selectedIssueKey = useSearchParams().get("selectedIssue")
  const selectedIssue = projectData?.issues.find(
    (issue) => issue.issueKey === selectedIssueKey
  )

  const projectUsers = projectData?.members

  console.log("selectedIssue", selectedIssue)

  const upsertProjectIssue = () => {
    const projectId = projectData?.id
    if (!projectId) throw new Error("No project id found")

    const projectMemberId = projectUsers?.find(
      (member) => member.userId === session?.user?.id
    )?.id

    const remainingIssueData = {
      projectId,
      reporterId: projectMemberId,
      issueKey: `${projectKey}-${projectData?.issueCount + 1}`,
    }

    return async (issueData: IssueData) => {
      console.log("Running upsertProjectIssue")
      const response = await fetch(`/api/projects/${projectId}/issues`, {
        method: "POST",
        body: JSON.stringify({
          ...issueData,
          ...remainingIssueData,
        } as Issue),
      })

      if (!response.ok) throw new Error("Failed to create issue")
      const data = await response.json()
      return data
    }
  }

  const { mutate: upsertIssue } = useMutation<
    () => Promise<(issueData: IssueData) => Promise<any>>,
    Error,
    IssueData,
    unknown
  >({
    mutationFn: upsertProjectIssue(),
    onSuccess: () => {
      toast({
        title: "Issue created",
        description: `Give it a second to show up on the board.`,
      })
    },
  })

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
      {/* {selectedIssue && (
        <CurrentIssue
          selectedIssue={selectedIssue}
          projectUsers={projectData?.members}
        />
      )} */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
        <Board
          issues={issuesByStatus[IssueStatus.IN_PROGRESS]}
          boardTitle="In progress"
          projectUsers={projectUsers}
          boardIssueStatusType={IssueStatus.IN_PROGRESS}
          upsertIssue={upsertIssue}
        />
        <Board
          issues={issuesByStatus[IssueStatus.TO_DO]}
          boardTitle="To do"
          projectUsers={projectUsers}
          boardIssueStatusType={IssueStatus.TO_DO}
          upsertIssue={upsertIssue}
        />
        <Board
          issues={issuesByStatus[IssueStatus.DONE]}
          boardTitle="Done"
          projectUsers={projectUsers}
          boardIssueStatusType={IssueStatus.DONE}
          upsertIssue={upsertIssue}
        />
      </div>
    </main>
  )
}

export default ProjectPage
