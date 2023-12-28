"use client"

import { useContext } from "react"
import { issuePriorities, issueStatuses, issueTypes } from "@/prisma/zod/issues"
import { Comment, Issue, Tag, User } from "@prisma/client"
import { UseMutateFunction } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header"

import { IssueActions } from "../edit-issue"
import { ProjectContext, ProjectContextData } from "../layout"

export interface FullIssue extends Issue {
  comments: Comment[]
  assignee: User | null
  tags: Tag[]
  reporter: User
}

const getColumns = (
  deleteIssue?: UseMutateFunction<() => Promise<any>, Error, string, unknown>
): ColumnDef<FullIssue>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "issueKey",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.original.issueKey}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    id: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const label = issueTypes.find(
        (type) => type.value === row.original.issueType
      )

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = issueStatuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="w-4 h-4 mr-2 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = issuePriorities.find(
        (priority) => priority.value === row.getValue("priority")
      )

      if (!priority) {
        return null
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="w-4 h-4 mr-2 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) =>
      deleteIssue ? (
        <div className="flex justify-end w-full">
          <IssueActions
            deleteIssue={deleteIssue}
            issue={{ id: row.original.id, issueKey: row.original.issueKey }}
          />
        </div>
      ) : null,
  },
]

const IssuesPage = () => {
  const { projectData, session, issueHandlers } =
    useContext<ProjectContextData>(ProjectContext)

  if (!projectData || !session) {
    return null
  }

  return (
    <main className="flex items-center justify-center w-full">
      <DataTable
        columns={getColumns(issueHandlers.deleteIssueMutation?.mutate)}
        data={projectData.issues as FullIssue[]}
        isSelectable={true}
        filterBy="title"
      />
    </main>
  )
}

export default IssuesPage
