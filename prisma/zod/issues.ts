import {
  Comment,
  Issue,
  IssueStatus,
  IssueType,
  Priority,
  ProjectMember,
  Tag,
} from "@prisma/client"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { z } from "zod"

import { CustomSelectItem } from "@/components/ui/select"

import { stringPreprocessor } from "./profile"

export const issuePriorities: CustomSelectItem[] = [
  {
    value: Priority.LOW,
    icon: ArrowDownIcon,
    label: "Low",
  },
  {
    value: Priority.MEDIUM,
    icon: ArrowRightIcon,
    label: "Medium",
  },
  {
    value: Priority.HIGH,
    icon: ArrowUpIcon,
    label: "High",
  },
  {
    value: Priority.URGENT,
    icon: ExclamationTriangleIcon,
    label: "Urgent",
  },
]

export const issueStatuses: CustomSelectItem[] = [
  {
    value: IssueStatus.TO_DO,
    label: "To do",
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

export const issueTypes: CustomSelectItem[] = [
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
  id: z.preprocess(stringPreprocessor, z.string().uuid().optional()),
  title: z.string().min(1).max(50).default("Untitled Issue").optional(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM).optional(),
  status: z.nativeEnum(IssueStatus).default(IssueStatus.TO_DO).optional(),
  issueType: z.nativeEnum(IssueType).default(IssueType.TASK).optional(),
  description: z.preprocess(stringPreprocessor, z.string().max(500).optional()),
  assigneeId: z.preprocess(
    stringPreprocessor,
    z.string().uuid().nullable().optional()
  ),
})

export type IssueReqData = z.infer<typeof issueSchema>

export interface IssueData extends Issue {
  assignee: ProjectMember | null
  comments: Comment[]
  reporter: ProjectMember
  tags: Tag[]
}
