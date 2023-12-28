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

export const IssueActions = ({
  issue,
  deleteIssue,
}: {
  issue: Issue
  deleteIssue: UseMutateFunction<() => Promise<any>, Error, string, unknown>
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-5 p-2 py-4">
          <Icons.moreHorizontal className="w-4 h-4" />
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
  deleteIssue: UseMutateFunction<() => Promise<any>, Error, string, unknown>
}

const CurrentIssue = ({
  selectedIssue,
  projectUsers,
  deleteIssue,
}: CurrentIssueProps) => {
  const form = useForm<IssueData>({
    resolver: zodResolver(issueSchema),
    defaultValues: { ...(selectedIssue as IssueData) },
  })

  const onSubmit: SubmitHandler<IssueData> = async (issueData) => {}

  return (
    <Sheet open={!!selectedIssue}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Issue</SheetTitle>
          <SheetDescription>
            You can edit the {"issue’s"} details and add comments.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            className="space-y-8 flex flex-col w-full items-center gap-3 px-4"
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
            <div className="flex flex-col bg-primary-foreground w-full items-center p-2">
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FormLabel>Assignee</FormLabel>
                      <Select
                        onValueChange={onChange}
                        value={value as string | undefined}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {projectUsers.map((member: ProjectUser) => (
                              <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center gap-2">
                                  <MemberAvatar
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
                  <FormLabel className="font-medium">Description</FormLabel>
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
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="ghost" className="w-full">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Save changes</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default CurrentIssue
