import { IssueData } from "@/prisma/zod/issues"
import { Issue, IssueStatus, IssueType } from "@prisma/client"
import { UseMutateFunction } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { ProjectUser } from "@/app/api/projects/key/[projectKey]/route"

import { IssueComponent } from "./project-issue"

interface BoardProps {
  issues: Issue[]
  boardTitle: string
  boardIssueStatusType: IssueStatus
  projectUsers?: ProjectUser[]
  upsertIssue: UseMutateFunction<
    () => Promise<(issueData: IssueData) => Promise<any>>,
    Error,
    IssueData,
    unknown
  >
}

const Board = ({
  issues,
  boardTitle,
  boardIssueStatusType,
  projectUsers,
  upsertIssue,
}: BoardProps) => {
  const createIssue = () => {
    upsertIssue({
      status: boardIssueStatusType,
    })
  }

  return (
    <Card className="flex flex-col justify-between w-full h-full col-span-3 border-none sm:col-span-1 bg-primary-foreground">
      <div className="flex flex-col w-full">
        <div className="p-2 space-y-1.5 px-3">
          <CardTitle className="text-xl font-medium">{boardTitle}</CardTitle>
        </div>
        <CardContent className="flex flex-col items-center w-full gap-4 p-2 px-3">
          {issues.map((issue) => (
            <IssueComponent
              projectUsers={projectUsers}
              key={issue.id}
              issue={issue}
            />
          ))}
        </CardContent>
      </div>
      <CardFooter className="p-2 mt-auto">
        <Button onClick={createIssue} variant="ghost" className="w-full">
          Create issue
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Board
