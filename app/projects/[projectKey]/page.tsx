"use client"

import { useContext, useState } from "react"
import { useSearchParams } from "next/navigation"
import { IssueWithComment } from "@/prisma/zod/issues"
import { Issue, IssueStatus } from "@prisma/client"

import { capitalize } from "@/lib/utils"
import BreadCrumbs from "@/components/breadcrumbs"
import Loading from "@/app/loading"

import Board from "./board"
import CurrentIssueEdit from "./edit-issue"
import { ProjectContext, ProjectContextData } from "./layout"

export interface PartialIssue extends Partial<Issue> {
  id: string
  issueKey: string
  reporterId: string
}

const ProjectPage = async ({
  params: { projectKey },
}: {
  params: { projectKey: string }
}) => {
  const { projectData, session, issueHandlers } =
    useContext<ProjectContextData>(ProjectContext)

  const selectedIssueKey = useSearchParams().get("selectedIssue")

  const comments =
    projectData?.members.flatMap((member) => member.comments) ?? []

  const issuesWithComments: IssueWithComment[] | undefined =
    projectData?.issues.map((issue) => ({
      ...issue,
      comments: comments.filter((comment) => comment.issueId === issue.id),
    }))

  const selectedIssueParam = projectData?.issues.find(
    (issue) => issue.issueKey === selectedIssueKey
  )

  const selectedIssueWithComment = selectedIssueParam
    ? ({
        ...selectedIssueParam,
        comments: comments.filter(
          (comment) => comment.issueId === selectedIssueParam.id
        ),
      } as IssueWithComment)
    : null

  const [selectedIssue, setSelectedIssue] = useState<IssueWithComment | null>(
    selectedIssueWithComment
  )

  if (!projectData) return <Loading />

  const projectMemberId = projectData.members?.find(
    (member) => member.userId === session?.user?.id
  )?.id

  const issuesByStatus = {
    [IssueStatus.TO_DO]: issuesWithComments!.filter(
      (issue) => issue.status === IssueStatus.TO_DO
    ),
    [IssueStatus.IN_PROGRESS]: issuesWithComments!.filter(
      (issue) => issue.status === IssueStatus.IN_PROGRESS
    ),
    [IssueStatus.DONE]: issuesWithComments!.filter(
      (issue) => issue.status === IssueStatus.DONE
    ),
  }

  return (
    <main className="flex flex-col w-full gap-5">
      <BreadCrumbs />
      <h1 className="text-2xl font-medium leading-8 tracking-tighter md:text-4xl">
        {projectKey.slice(0, 3)} board
      </h1>
      <CurrentIssueEdit
        deleteIssue={issueHandlers.deleteIssueMutation.mutate}
        selectedIssue={selectedIssue}
        projectUsers={projectData?.members}
        resetSelectedIssue={() => setSelectedIssue(null)}
        updateIssue={issueHandlers.updateIssueMutation.mutate}
        createCommentMutation={issueHandlers.createCommentMutation}
        projectMemberId={projectMemberId ?? null}
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-3">
        {Object.entries(issuesByStatus).map(([status, issues]) => (
          <Board
            issues={issues}
            boardTitle={capitalize(status.split("_").join(" "))}
            projectUsers={projectData?.members}
            boardIssueStatusType={status as IssueStatus}
            issueHandlers={issueHandlers}
            setSelectedIssue={setSelectedIssue}
          />
        ))}
      </div>
    </main>
  )
}

export default ProjectPage
