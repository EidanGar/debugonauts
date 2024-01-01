"use client"

import { createContext } from "react"
import { IssueData, IssueReqData } from "@/prisma/zod/issues"
import {
  UseMutationResult,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { Session } from "next-auth"
import { useSession } from "next-auth/react"

import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { SidebarNav } from "@/components/sidebar-nav"
import {
  deleteProjectIssue,
  updateProjectIssue,
} from "@/app/api/issues/[issueId]/route"
import { createProjectIssue } from "@/app/api/projects/[projectId]/issues/route"
import {
  FullProject,
  ProjectResponse,
  fetchProjectData,
} from "@/app/api/projects/key/[projectKey]/route"
import Loading from "@/app/loading"
import NotFoundPage from "@/app/not-found"

export interface IssueHandler {
  createIssueMutation: UseMutationResult<
    IssueData,
    Error,
    IssueReqData,
    unknown
  >
  updateIssueMutation: UseMutationResult<
    IssueData,
    Error,
    IssueReqData,
    unknown
  >
  deleteIssueMutation: UseMutationResult<string, Error, string, unknown>
}

export interface ProjectContextData {
  issueHandlers: IssueHandler
  projectData: FullProject | null
  session: Session | null
}

export const ProjectContext = createContext<ProjectContextData>({
  projectData: null,
  session: null,
  issueHandlers: {
    createIssueMutation: {} as IssueHandler["createIssueMutation"],
    updateIssueMutation: {} as IssueHandler["updateIssueMutation"],
    deleteIssueMutation: {} as IssueHandler["deleteIssueMutation"],
  },
})

export const getProjectDataQueryOptions = (projectKey: string) => {
  return queryOptions<ProjectResponse["project"], Error>({
    queryKey: ["project", projectKey],
    queryFn: () => fetchProjectData(projectKey),
    enabled: !!projectKey,
    staleTime: 60000,
  })
}

interface ProjectLayoutProps {
  children: React.ReactNode
  params: { projectKey: string }
}

export default function ProjectLayout({
  children,
  params: { projectKey },
}: ProjectLayoutProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const {
    data: projectData,
    error,
    status,
  } = useQuery(getProjectDataQueryOptions(projectKey))
  const queryClient = useQueryClient()

  const largestIssueIdx = Math.max(
    ...(projectData?.issues.map((issue) => +issue.issueKey.split("-")[1]) ??
      ([] as number[]))
  )

  const projectMemberId = projectData?.members?.find(
    (member) => member.userId === session?.user?.id
  )?.id

  const createIssueFn = createProjectIssue(
    projectKey,
    largestIssueIdx,
    projectData?.id,
    projectMemberId
  )

  const createIssueMutation: IssueHandler["createIssueMutation"] = useMutation({
    mutationFn: createIssueFn,
    onSuccess: () => {
      toast({
        title: "Issue created",
        description: `Give it a second to show up on the board.`,
      })
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["project", projectKey] }),
  })

  const updateIssueMutation: IssueHandler["updateIssueMutation"] = useMutation({
    mutationFn: updateProjectIssue,
    onSuccess: () => {
      toast({
        title: "Issue updated",
        description: `Give it a second to show up on the board.`,
      })
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["project", projectKey] }),
  })

  const deleteIssueMutation: IssueHandler["deleteIssueMutation"] = useMutation({
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

  if (error) {
    toast({
      title: error?.name,
      description: error?.message,
    })

    return <NotFoundPage />
  }

  const sidebarNavProjectItems = [
    {
      title: "Board",
      Icon: Icons.board,
      href: `/projects/${projectKey}`,
    },
    {
      title: "Teams",
      Icon: Icons.users,
      href: `/projects/${projectKey}/teams`,
    },
    {
      title: "Issues",
      Icon: Icons.details,
      href: `/projects/${projectKey}/issues`,
    },
    {
      title: "Timeline",
      Icon: Icons.calendar,
      href: `/projects/${projectKey}/timeline`,
    },
    {
      title: "Settings",
      Icon: Icons.settings,
      href: `/projects/${projectKey}/settings`,
    },
  ]

  return (
    <ProjectContext.Provider
      value={{
        projectData: projectData ?? null,
        session,
        issueHandlers: {
          createIssueMutation,
          updateIssueMutation,
          deleteIssueMutation,
        } as IssueHandler,
      }}
    >
      <div className="px-[calc(10vw/2)] pt-4 pb-8 w-full space-y-6 sm:p-10 sm:pb-16">
        <div className="flex flex-col items-start w-full gap-6 lg:gap-16 lg:flex-row">
          <aside className="w-full sm:-mx-4 lg:w-1/5 sm:px-0">
            <SidebarNav items={sidebarNavProjectItems} />
          </aside>
          <div className="flex items-center flex-1 flex-grow w-full">
            {status === "pending" ? <Loading /> : children}
          </div>
        </div>
      </div>
    </ProjectContext.Provider>
  )
}
