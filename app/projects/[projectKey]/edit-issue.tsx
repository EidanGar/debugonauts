import { useEffect, useState } from "react"
import {
  IssueData,
  IssueReqData,
  IssueWithComment,
  issuePriorities,
  issueSchema,
  issueStatuses,
  issueTypes,
} from "@/prisma/zod/issues"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseMutateFunction } from "@tanstack/react-query"
import { SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
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
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { CommentReqData } from "@/app/api/issues/[issueId]/comment/route"
import { ProjectUser } from "@/app/api/projects/key/[projectKey]/route"

import { IssueActions, MemberAvatar } from "./board"
import { IssueHandler } from "./layout"

interface CurrentIssueEditProps {
  selectedIssue: IssueWithComment | null
  projectUsers: ProjectUser[]
  deleteIssue: UseMutateFunction<string, Error, string, unknown>
  resetSelectedIssue: () => void
  updateIssue: UseMutateFunction<IssueData, Error, IssueReqData, unknown>
  createCommentMutation: IssueHandler["createCommentMutation"]
  projectMemberId: string | null
}

interface CommentAndUser {
  user: ProjectUser["user"]
  comment: ProjectUser["comments"][0]
}

const Comment = ({ comment, user }: CommentAndUser) => {
  return (
    <div className="w-full p-3 rounded-md bg-primary-foreground">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2">
          <MemberAvatar size={28} image={user.image} name={user.name} />
          <span>{user.name}</span>
        </div>
        <span className="text-xs text-primary-text">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="w-full mt-2 text-sm text-primary-text">{comment.content}</p>
    </div>
  )
}

const CurrentIssueEdit = ({
  selectedIssue,
  projectUsers,
  deleteIssue,
  resetSelectedIssue,
  updateIssue,
  createCommentMutation,
  projectMemberId,
}: CurrentIssueEditProps) => {
  const { toast } = useToast()
  const form = useForm<IssueReqData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      ...(selectedIssue as IssueReqData),
    },
    resetOptions: {
      keepErrors: true,
    },
  })

  const [newCommentContent, setNewCommentContent] = useState<string | null>(
    null
  )

  const [issueCommentsWithUsers, setIssueCommentsWithUsers] = useState<
    CommentAndUser[]
  >([])

  const commentsWithUsers = selectedIssue?.comments.map((comment) => ({
    comment,
    user: projectUsers.find((member) => member.id === comment.authorId)?.user,
  }))

  const createComment = () => {
    if (!selectedIssue || !newCommentContent || !projectMemberId) return

    createCommentMutation.mutate(
      {
        issueId: selectedIssue?.id as string,
        commentData: {
          content: newCommentContent as string,
          authorId: projectMemberId,
        },
      } as {
        issueId: string
        commentData: CommentReqData
      },
      {
        onSettled(data) {
          if (!data) return

          const user = projectUsers.find(
            (member) => member.id === data.authorId
          )?.user as ProjectUser["user"]

          setIssueCommentsWithUsers((prev) => [
            ...prev,
            {
              comment: data,
              user,
            },
          ])
        },
        onError: (error) => {
          toast({
            title: "Error creating comment",
            description: error.message,
          })
        },
      }
    )

    setNewCommentContent(null)
  }

  useEffect(() => {
    form.reset({ ...(selectedIssue as IssueReqData) })
  }, [form, selectedIssue])

  const onSubmit: SubmitHandler<IssueReqData> = async (issueData) => {
    if (!selectedIssue) return
    updateIssue({ ...issueData, id: selectedIssue?.id })
  }

  return (
    <Sheet open={!!selectedIssue}>
      <SheetContent
        className="w-full overflow-y-scroll sm:max-w-md"
        onClick={resetSelectedIssue}
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
                defaultValue={selectedIssue?.title ?? ""}
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
                <IssueActions
                  deleteIssue={deleteIssue}
                  issue={selectedIssue as { id: string; issueKey: string }}
                />
              )}
            </div>
            <div className="flex items-center w-full gap-3">
              <FormField
                control={form.control}
                name="issueType"
                defaultValue={selectedIssue?.issueType}
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
                defaultValue={selectedIssue?.status}
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
            <div className="flex flex-col items-center w-full gap-3 p-3 rounded-md bg-primary-foreground">
              <FormField
                control={form.control}
                name="assigneeId"
                defaultValue={selectedIssue?.assigneeId}
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
                defaultValue={selectedIssue?.priority}
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
              defaultValue={selectedIssue?.description ?? ""}
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
            <SheetFooter className="flex flex-row items-center w-full gap-3 mt-5">
              <SheetClose asChild>
                <Button
                  onClick={resetSelectedIssue}
                  className="flex-1"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                onClick={resetSelectedIssue}
                className="flex-1"
                type="submit"
              >
                Save changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
        <div className="flex flex-col items-center w-full gap-3 mt-5">
          <div className="flex items-center justify-between w-full gap-2">
            <h3 className="font-medium">Comments</h3>
            <Button variant="ghost" onClick={() => setNewCommentContent("")}>
              <Icons.plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col w-full gap-3">
            {[
              ...((commentsWithUsers ?? []) as CommentAndUser[]),
              ...(issueCommentsWithUsers as CommentAndUser[]),
            ]?.map(({ comment, user }) => (
              <Comment key={comment.id} comment={comment} user={user} />
            ))}
            {newCommentContent !== null && (
              <div className="flex flex-col items-end w-full gap-3 p-3 rounded-md bg-primary-foreground">
                <Textarea
                  onChange={(e) => setNewCommentContent(e.target.value)}
                />
                <Button onClick={createComment}>Comment</Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CurrentIssueEdit
