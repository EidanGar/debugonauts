import { useState } from "react"
import Image from "next/image"
import { IssueData, IssueReqData, IssueWithComment } from "@/prisma/zod/issues"
import { IssueStatus } from "@prisma/client"
import { UseMutateFunction } from "@tanstack/react-query"
import { FaPencilAlt as Pencil } from "react-icons/fa"
import { FaCheck as Check } from "react-icons/fa6"

import { userConfig } from "@/lib/config/user"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"
import { ProjectUser } from "@/app/api/projects/key/[projectKey]/route"

import { IssueHandler } from "./layout"

interface BoardProps {
  issues: IssueWithComment[]
  boardTitle: string
  boardIssueStatusType: IssueStatus
  projectUsers?: ProjectUser[]
  issueHandlers: IssueHandler
  setSelectedIssue: React.Dispatch<
    React.SetStateAction<IssueWithComment | null>
  >
}

interface IssueProps {
  updateIssue: UseMutateFunction<IssueData, Error, IssueReqData, unknown>
  issue: IssueWithComment
  projectUsers?: ProjectUser[]
  isPending?: boolean
  deleteIssue: UseMutateFunction<string, Error, string, unknown>
  setSelectedIssue: React.Dispatch<
    React.SetStateAction<IssueWithComment | null>
  >
}

export const MemberAvatar = ({
  image,
  name,
  size = 36,
}: {
  image?: string | null
  name?: string
  size?: number
}) => {
  return (
    <Image
      width={size}
      height={size}
      className="object-cover duration-300 rounded-full cursor-pointer hover:ring-4 hover:ring-accent"
      alt={name ?? "Unassigned user"}
      src={image ?? userConfig.defaultUserImage}
    />
  )
}

interface IssueActionsProps {
  issue: {
    id: string
    issueKey: string
  }
  deleteIssue: UseMutateFunction<string, Error, string, unknown>
}

export const IssueActions = ({ issue, deleteIssue }: IssueActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex justify-end" asChild>
        <Button variant="ghost" className="h-5 p-2 py-4">
          <Icons.moreHorizontal className="w-4 h-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Copy issue link</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Copy issue key</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Move issue</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Edit issue</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => deleteIssue(issue.id)}>
          <span>Delete issue</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const IssueComponent = ({
  issue,
  projectUsers,
  isPending = false,
  deleteIssue,
  updateIssue,
  setSelectedIssue,
}: IssueProps) => {
  const [issueTitle, setIssueTitle] = useState("Untitled Issue")
  const [assigneeId, setAssigneeId] = useState<null | string>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const updateIssueAssignee = (val: string | null) => {
    setAssigneeId(val)
    updateIssue({
      id: issue?.id,
      assigneeId: val,
    } as IssueReqData)
  }

  const updateIssueTitle = () => {
    updateIssue({
      id: issue?.id,
      title: issueTitle,
    } as IssueReqData)
  }

  return (
    <div
      className={`flex flex-col items-center w-full gap-2 p-3 rounded-md bg-background ${
        isPending ? "animate-pulse opacity-75" : ""
      }`}
    >
      <div className="flex items-center justify-between w-full gap-3">
        <div className="relative">
          <Input
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 500)}
            onChange={(e) => setIssueTitle(e.target.value as string)}
            defaultValue={issue?.title ?? issueTitle}
            disabled={isPending || !issue}
            type="text"
            className="w-full px-2 text-base border-none rounded-sm outline-none hover:bg-primary-foreground ring-0 focus-visible:ring-0 focus:bg-background bg-background"
          />
          {isInputFocused && (
            <Check
              onClick={updateIssueTitle}
              className="absolute left-[87%] top-1/2 -translate-y-1/2 h-4 w-4"
            />
          )}
        </div>
        <Button
          variant="ghost"
          className="h-5 px-2 py-4"
          onClick={() => setSelectedIssue(issue)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        {issue.id && issue.issueKey && (
          <IssueActions
            deleteIssue={deleteIssue}
            issue={{ id: issue.id, issueKey: issue.issueKey }}
          />
        )}
      </div>
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            defaultChecked={true}
            className="pointer-events-none"
            disabled
          />
          <span>{issue?.issueKey}</span>
        </div>
        <Popover>
          <PopoverTrigger className="cursor-pointer" asChild>
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent focus-visible:ring-0"
            >
              <MemberAvatar />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Assign Issue" />
              <CommandEmpty>No member found</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  className="cursor-pointer"
                  onSelect={(val) => updateIssueAssignee(val)}
                >
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
                      className="cursor-pointer"
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
  issueHandlers,
  setSelectedIssue,
}: BoardProps) => {
  const pendingCreationIssue =
    issueHandlers.createIssueMutation.isPending &&
    issueHandlers.createIssueMutation.variables.status === boardIssueStatusType
      ? (issueHandlers.createIssueMutation.variables as IssueReqData)
      : undefined

  const createIssue = () => {
    issueHandlers.createIssueMutation.mutate({
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
          {issues.map((issue) => {
            const isIssuePendingDeletion =
              issueHandlers.deleteIssueMutation.isPending &&
              issueHandlers.deleteIssueMutation.variables === issue.id

            const isIssuePendingUpdate =
              issueHandlers.updateIssueMutation.isPending &&
              issueHandlers.updateIssueMutation.variables.id === issue.id

            // TODO: Issue data is not updated after a successful mutation
            const issueData: IssueWithComment = isIssuePendingUpdate
              ? {
                  ...issue,
                  ...issueHandlers.updateIssueMutation.variables,
                }
              : issue

            return (
              <IssueComponent
                isPending={isIssuePendingDeletion && isIssuePendingUpdate}
                projectUsers={projectUsers}
                deleteIssue={issueHandlers.deleteIssueMutation.mutate}
                key={issue.id}
                updateIssue={issueHandlers.updateIssueMutation.mutate}
                issue={issueData}
                setSelectedIssue={setSelectedIssue}
              />
            )
          })}
          {pendingCreationIssue && (
            <IssueComponent
              isPending={true}
              projectUsers={projectUsers}
              updateIssue={issueHandlers.updateIssueMutation.mutate}
              deleteIssue={issueHandlers.deleteIssueMutation.mutate}
              setSelectedIssue={setSelectedIssue}
              issue={
                {
                  ...pendingCreationIssue,
                } as IssueWithComment
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
