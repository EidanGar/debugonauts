"use client"

import { useContext } from "react"
import { useSearchParams } from "next/navigation"
import { IssueData } from "@/prisma/zod/issues"
import { IssueStatus } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { capitalize } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import BreadCrumbs from "@/components/breadcrumbs"
import { updateProjectIssue } from "@/app/api/issues/[issueId]/route"
import { createProjectIssue } from "@/app/api/projects/[projectId]/issues/route"
import Loading from "@/app/loading"

import Board from "./board"
import CurrentIssue from "./edit-issue"
import { ProjectAndSession, ProjectContext } from "./layout"

const deleteProjectIssue = async (issueId: string) => {
  const response = await fetch(`/api/issues/${issueId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    console.error("Failed to delete issue")
  }

  const data = await response.json()

  if (data.isError) {
    throw new Error(JSON.stringify(data, null, 2))
  }

  return data
}

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

  const queryClient = useQueryClient()

  const largestIssueIdx = Math.max(
    ...(projectData?.issues.map((issue) => +issue.issueKey.split("-")[1]) ??
      ([] as number[]))
  )

  const projectMemberId = projectUsers?.find(
    (member) => member.userId === session?.user?.id
  )?.id

  const {
    mutate: createIssue,
    isPending,
    variables,
  } = useMutation<
    () => Promise<(issueData: IssueData) => Promise<any>>,
    Error,
    IssueData,
    unknown
  >({
    mutationFn: createProjectIssue(
      projectKey,
      largestIssueIdx,
      projectData?.id,
      projectMemberId
    ),
    onSuccess: () => {
      toast({
        title: "Issue created",
        description: `Give it a second to show up on the board.`,
      })
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["project", projectKey] }),
  })

  const { mutate: updateIssue } = useMutation<
    () => Promise<(issueData: IssueData) => Promise<any>>,
    Error,
    IssueData,
    unknown
  >({
    mutationFn: updateProjectIssue,
    onSuccess: () => {
      toast({
        title: "Issue updated",
        description: `Give it a second to show up on the board.`,
      })
    },
  })

  const {
    mutate: deleteIssue,
    isPending: isPendingDeletion,
    variables: deletionVariableId,
  } = useMutation<() => Promise<any>, Error, string, unknown>({
    mutationFn: deleteProjectIssue,
    onSuccess: () => {
      toast({
        title: "Issue deleted",
        description: `Give it a second to disappear from the board.`,
      })
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["project", projectKey] }),
  })

  const issueHandlers = {
    createIssue,
    updateIssue,
    deleteIssue,
  }

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
      {/* <CurrentIssue
        deleteIssue={deleteIssue}
        selectedIssue={selectedIssue}
        projectUsers={projectData?.members}
      /> */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
        {Object.entries(issuesByStatus).map(([status, issues]) => (
          <Board
            issues={issues}
            boardTitle={capitalize(status.split("_").join(" "))}
            projectUsers={projectUsers}
            boardIssueStatusType={status as IssueStatus}
            issueHandlers={issueHandlers}
            pendingCreationIssue={
              isPending && variables.status === status
                ? (variables as IssueData)
                : undefined
            }
            pendingDeletion={{ isPendingDeletion, deletionVariableId }}
          />
        ))}
      </div>
    </main>
  )
}

export default ProjectPage
