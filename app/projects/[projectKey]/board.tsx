import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IssueData } from "@/prisma/zod/issues"
import { Issue, IssueStatus, IssueType, Priority } from "@prisma/client"
import { UseMutateFunction } from "@tanstack/react-query"
import { FaPencilAlt as Pencil } from "react-icons/fa"
import { FaCheck as Check } from "react-icons/fa6"

import { userConfig } from "@/lib/config/user"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ProjectUser } from "@/app/api/projects/key/[projectKey]/route"

import { IssueActions, MemberAvatar } from "./edit-issue"

interface IssueHandler {
  createIssue: UseMutateFunction<
    () => Promise<(issueData: IssueData) => Promise<any>>,
    Error,
    IssueData,
    unknown
  >
  updateIssue: UseMutateFunction<
    () => Promise<(issueData: IssueData) => Promise<any>>,
    Error,
    IssueData,
    unknown
  >
  deleteIssue: UseMutateFunction<() => Promise<any>, Error, string, unknown>
}

interface BoardProps {
  issues: Issue[]
  boardTitle: string
  boardIssueStatusType: IssueStatus
  projectUsers?: ProjectUser[]
  issueHandlers: IssueHandler
  pendingCreationIssue?: IssueData
  pendingDeletion: {
    isPendingDeletion?: boolean
    deletionVariableId?: string
  }
}

interface IssueProps {
  updateIssue: IssueHandler["updateIssue"]
  issue: Issue
  projectUsers?: ProjectUser[]
  isPending?: boolean
  deleteIssue: IssueHandler["deleteIssue"]
}

export const IssueComponent = ({
  issue,
  projectUsers,
  isPending = false,
  deleteIssue,
  updateIssue,
}: IssueProps) => {
  const [issueTitle, setIssueTitle] = useState("Untitled Issue")
  const [assigneeId, setAssigneeId] = useState<null | string>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const pathname = usePathname()
  const issueHref = `${pathname}/?selectedIssue=${issue.issueKey}`

  const updateIssueAssignee = (val: string | null) => {
    setAssigneeId(val)
    updateIssue({
      id: issue.id,
      assigneeId: val,
    } as IssueData)
  }

  const updateIssueTitle = () => {
    updateIssue({
      id: issue.id,
      title: issueTitle,
    } as IssueData)
  }

  return (
    <div
      className={`flex cursor-pointer flex-col items-center w-full gap-2 p-3 rounded-md bg-background ${
        isPending ? "animate-pulse opacity-75" : ""
      }`}
    >
      <div className="flex items-center justify-between w-full gap-3">
        <div className="relative">
          <Input
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 500)}
            onChange={(e) => setIssueTitle(e.target.value as string)}
            defaultValue={issue.title ?? issueTitle}
            type="text"
            className="hover:bg-primary-foreground outline-none text-base px-2 rounded-sm border-none ring-0 focus-visible:ring-0 w-full focus:bg-background bg-background border-none"
          />
          {isInputFocused && (
            <Check
              onClick={updateIssueTitle}
              className="absolute left-[87%] top-1/2 -translate-y-1/2 h-4 w-4"
            />
          )}
        </div>
        <Link
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "h-5 px-2 py-4"
          )}
          href={issueHref}
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <IssueActions deleteIssue={deleteIssue} issue={issue} />
      </div>
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            defaultChecked={true}
            className="pointer-events-none"
            disabled
          />
          <span>{issue.issueKey}</span>
        </div>
        <Popover>
          <PopoverTrigger className="cursor-pointer" asChild>
            <Button variant="ghost" className="p-0">
              <MemberAvatar />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Assign Issue" />
              <CommandEmpty>No member found</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={(val) => updateIssueAssignee(val)}>
                  <div className="flex items-center gap-2">
                    <MemberAvatar
                      size={18}
                      image={userConfig.defaultUserImage}
                      name="unassigned"
                    />
                    <span>Unassigned</span>
                  </div>
                </CommandItem>
                {projectUsers &&
                  projectUsers?.map((member) => (
                    <CommandItem
                      value={member.id}
                      key={member.id}
                      onSelect={(val) => updateIssueAssignee(val)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          member.id === assigneeId ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <MemberAvatar
                          size={18}
                          image={member.user.image}
                          name={member.user.name}
                        />
                        <span>{member.user.name}</span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

const Board = ({
  issues,
  boardTitle,
  boardIssueStatusType,
  projectUsers,
  pendingCreationIssue,
  pendingDeletion,
  issueHandlers,
}: BoardProps) => {
  const createIssue = () => {
    issueHandlers.createIssue({
      status: boardIssueStatusType,
    })
  }

  // TODO: Remove this temp issue
  const tempIssue = {
    title: "Untitled Issue",
    issueType: IssueType.TASK,
    id: "temp-issue",
    issueKey: "ABC-123",
    summary: "Untitled Issue",
    status: boardIssueStatusType,
    priority: Priority.LOW as Priority,
    description: "",
    projectId: "",
    reporterId: "",
    createdAt: new Date() as Date,
    updatedAt: new Date() as Date,
    assigneeId: "",
  } as Issue

  return (
    <Card className="flex flex-col justify-between w-full h-full col-span-3 border-none sm:col-span-1 bg-primary-foreground">
      <div className="flex flex-col w-full">
        <div className="p-2 space-y-1.5 px-3">
          <CardTitle className="text-xl font-medium">{boardTitle}</CardTitle>
        </div>
        <CardContent className="flex flex-col items-center w-full gap-4 p-2 px-3">
          {issues.map((issue) => {
            const isIssuePendingDeletion =
              pendingDeletion.isPendingDeletion &&
              pendingDeletion.deletionVariableId === issue.id

            return (
              <IssueComponent
                isPending={isIssuePendingDeletion}
                projectUsers={projectUsers}
                deleteIssue={issueHandlers.deleteIssue}
                key={issue.id}
                updateIssue={issueHandlers.updateIssue}
                issue={issue}
              />
            )
          })}
          {pendingCreationIssue && (
            <IssueComponent
              isPending={true}
              projectUsers={projectUsers}
              updateIssue={issueHandlers.updateIssue}
              deleteIssue={issueHandlers.deleteIssue}
              issue={
                {
                  ...tempIssue,
                  ...pendingCreationIssue,
                } as Issue
              }
            />
          )}
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
