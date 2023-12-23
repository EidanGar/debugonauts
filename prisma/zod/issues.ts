import { IssueStatus, IssueType, Priority } from "@prisma/client"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { z } from "zod"

import { stringPreprocess } from "./profile"

export const issuePriorities = [
  {
    value: Priority.LOW,
    label: "Low",
    icon: ArrowDownIcon,
  },
  {
    value: Priority.MEDIUM,
    label: "Medium",
    icon: ArrowRightIcon,
  },
  {
    value: Priority.HIGH,
    label: "High",
    icon: ArrowUpIcon,
  },
  {
    value: Priority.URGENT,
    label: "Urgent",
    icon: ExclamationTriangleIcon,
  },
]

export const issueStatuses = [
  {
    value: IssueStatus.OPEN,
    label: "Open",
    icon: CircleIcon,
  },
  {
    value: IssueStatus.IN_PROGRESS,
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: IssueStatus.CANCELLED,
    label: "Cancelled",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: IssueStatus.DONE,
    label: "Done",
    icon: CheckCircledIcon,
  },
]

export const issueTypes = [
  {
    value: IssueType.BUG,
    label: "Bug",
  },
  {
    value: IssueType.FEATURE_REQUEST,
    label: "Feature",
  },
  {
    value: IssueType.TASK,
    label: "Task",
  },
  {
    value: IssueType.STORY,
    label: "Story",
  },
  {
    value: IssueType.EPIC,
    label: "Epic",
  },
]

export const issueSchema = z.object({
  title: z.string().min(1).max(50),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  status: z.nativeEnum(IssueStatus).default(IssueStatus.OPEN),
  type: z.nativeEnum(IssueType).default(IssueType.TASK),
  description: z.preprocess(stringPreprocess, z.string().max(500)),
  assigneeId: z.string().uuid(),
})

export type IssueData = z.infer<typeof issueSchema>
