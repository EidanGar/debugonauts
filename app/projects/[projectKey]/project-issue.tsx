import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IssueData,
  issuePriorities,
  issueSchema,
  issueStatuses,
  issueTypes,
} from "@/prisma/zod/issues"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProjectMember, type Issue } from "@prisma/client"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { CheckIcon } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"

import { userConfig } from "@/lib/config/user"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { ProjectUser } from "@/app/api/projects/key/[projectKey]/route"

const MemberAvatar = ({
  image,
  name,
}: {
  image?: string | null
  name?: string
}) => {
  return (
    <Image
      width={36}
      height={36}
      className="object-cover duration-300 rounded-full cursor-pointer hover:ring-4 hover:ring-accent"
      alt={name ?? "Unassigned user"}
      src={image ?? userConfig.defaultUserImage}
    />
  )
}

const IssueActions = ({ issue }: { issue: Issue }) => {
  const deleteIssue = async (issueId: string) => {
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

export const IssueComponent = ({
  issue,
  projectUsers,
}: {
  issue: Issue
  projectUsers?: ProjectUser[]
}) => {
  const [issueTitle, setIssueTitle] = useState("Untitled Issue")
  const [assigneeId, setAssigneeId] = useState<null | string>(null)
  const pathname = usePathname()
  const issueHref = `${pathname}/?selectedIssue=${issue.issueKey}`

  return (
    <Link
      href={issueHref}
      className="flex cursor-pointer flex-col items-center w-full gap-2 p-3 rounded-md bg-background"
    >
      <div className="flex items-center justify-between w-full gap-3">
        <div className="relative">
          <Input
            onChange={(e) => setIssueTitle(e.target.value as string)}
            defaultValue={issueTitle}
            type="text"
            className="peer hover:bg-primary-foreground outline-none text-base px-2 rounded-none border-none ring-0 focus-visible:ring-0 w-full focus:bg-background bg-background border-none"
          />
          <CheckIcon className="absolute peer-focus:block hidden left-[87%] top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>
        <IssueActions issue={issue} />
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
            <MemberAvatar />
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Assign Issue" />
              <CommandEmpty>No member found</CommandEmpty>
              <CommandGroup>
                {projectUsers &&
                  projectUsers?.map((member) => (
                    <CommandItem
                      value={member.id}
                      key={member.id}
                      onSelect={() => {
                        setAssigneeId(member.id)
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          member.id === assigneeId ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <MemberAvatar
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
    </Link>
  )
}

interface CurrentIssueProps {
  selectedIssue: Issue
  projectUsers: ProjectUser[]
}

const CurrentIssue = ({ selectedIssue, projectUsers }: CurrentIssueProps) => {
  const form = useForm<IssueData>({
    resolver: zodResolver(issueSchema),
    defaultValues: selectedIssue as IssueData,
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
              {selectedIssue && <IssueActions issue={selectedIssue} />}
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
                      <Select onValueChange={onChange} value={value}>
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
