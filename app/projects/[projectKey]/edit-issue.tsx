import { useState } from "react"
import Image from "next/image"
import {
  IssueData,
  issuePriorities,
  issueSchema,
  issueStatuses,
  issueTypes,
} from "@/prisma/zod/issues"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Issue } from "@prisma/client"
import { UseMutateFunction } from "@tanstack/react-query"
import { SubmitHandler, useForm } from "react-hook-form"

import { userConfig } from "@/lib/config/user"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  CustomSelect,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { ProjectUser } from "@/app/api/projects/key/[projectKey]/route"

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
  deleteIssue: UseMutateFunction<() => Promise<any>, Error, string, unknown>
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

interface CurrentIssueProps {
  selectedIssue?: Issue
  projectUsers: ProjectUser[]
  deleteIssue: UseMutateFunction<any, Error, string, unknown>
  isIssueSheetOpen: boolean
  setIsIssueSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
  updateIssue: UseMutateFunction<any, Error, IssueData, unknown>
}

const CurrentIssue = ({
  selectedIssue,
  projectUsers,
  deleteIssue,
  isIssueSheetOpen,
  setIsIssueSheetOpen,
  updateIssue,
}: CurrentIssueProps) => {
  const form = useForm<IssueData>({
    resolver: zodResolver(issueSchema),
    defaultValues: { ...(selectedIssue as IssueData) },
  })
  const onSubmit: SubmitHandler<IssueData> = async (issueData) => {
    updateIssue({ ...issueData, id: selectedIssue?.id })
  }

  return (
    <Sheet open={isIssueSheetOpen && !!selectedIssue}>
      <SheetContent
        className="overflow-y-scroll w-full sm:max-w-md"
        onClick={() => setIsIssueSheetOpen(false)}
      >
        <SheetHeader>
          <SheetTitle>Edit Issue</SheetTitle>
          <SheetDescription>
            You can edit the {"issue’s"} details and add comments.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            className="flex flex-col items-center w-full gap-3 mt-5"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <div className="flex items-center w-full gap-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="hover:bg-primary-foreground"
                        type="text"
                        required={false}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedIssue && (
                <IssueActions deleteIssue={deleteIssue} issue={selectedIssue} />
              )}
            </div>
            <div className="flex items-center w-full gap-3">
              <FormField
                control={form.control}
                name="issueType"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <CustomSelect
                        {...{ onChange, value, items: issueTypes }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <CustomSelect
                        {...{ onChange, value, items: issueStatuses }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <h3 className="w-full text-start">Issue details</h3>
            <div className="flex gap-3 flex-col rounded-md items-center w-full p-3 bg-primary-foreground">
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="w-full">
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={onChange}
                        value={value as string | undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectItem key="Unassigned" value="unassigned">
                              <div className="flex items-center gap-2">
                                <MemberAvatar
                                  size={18}
                                  image={userConfig.defaultUserImage}
                                  name="unassigned"
                                />
                                <span>Unassigned</span>
                              </div>
                            </SelectItem> */}
                            {projectUsers.map((member: ProjectUser) => (
                              <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center gap-2">
                                  <MemberAvatar
                                    size={22}
                                    image={member.user.image}
                                    name={member.user.name}
                                  />
                                  <span>{member.user.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="w-full">
                    <FormLabel>Priority level</FormLabel>
                    <FormControl>
                      <CustomSelect
                        {...{ onChange, value, items: issuePriorities }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full hover:bg-primary-foreground"
                      placeholder="Describe the issue in detail."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="flex w-full gap-3 flex-row items-center mt-5">
              <SheetClose asChild>
                <Button
                  onClick={() => setIsIssueSheetOpen(false)}
                  className="flex-1"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button className="flex-1" type="submit">
                Save changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default CurrentIssue
