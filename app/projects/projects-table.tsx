import Image from "next/image"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { userConfig } from "@/lib/config/user"
import { capitalize } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"

import { ProjectWithFullLead } from "../api/users/projects/route"
import { getProjectDataQueryOptions } from "./[projectKey]/layout"

const ProjectName = ({
  projectKey,
  name,
}: {
  projectKey: string
  name: string
}) => {
  const queryClient = useQueryClient()

  const prefetch = () => {
    queryClient.prefetchQuery(getProjectDataQueryOptions(projectKey))
  }

  return (
    <Link
      onMouseEnter={prefetch}
      className="ml-2 underline-offset-4 hover:underline text-primary"
      style={{
        padding: 0,
      }}
      href={`/projects/${projectKey}`}
    >
      {name}
    </Link>
  )
}

const projectColumns: ColumnDef<ProjectWithFullLead, unknown>[] = [
  {
    accessorKey: "name",
    id: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <ProjectName
        name={row.original.name}
        projectKey={row.original.projectKey}
      />
    ),
  },
  {
    accessorKey: "projectKey",
    id: "key",
    header: "Key",
    cell: ({ row }) => <span>{row.original.projectKey}</span>,
  },
  {
    accessorKey: "visibility",
    id: "visibility",
    header: "Visibility",
    cell: ({ row }) => {
      return <span>{capitalize(row.original.visibility)}</span>
    },
  },
  {
    accessorKey: "projectLeadId",
    id: "lead",
    header: "Lead",
    cell: ({ row }) => {
      return (
        <div className="flex items-center h-full gap-2">
          <Image
            className="inline-block mr-2 rounded-full w-7 h-7"
            width={28}
            height={28}
            src={row.original.projectLead.image ?? userConfig.defaultUserImage}
            alt={row.original.projectLead.name}
          />
          <span>{row.original.projectLead.name}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteProject = async (id: string) => {
        const res = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
        })

        const response = await res.json()

        if (res.status !== 200 || response.isError) {
          throw new Error(response.message)
        }
      }

      return (
        <div className="flex justify-end w-full">
          <AlertDialog onOpenChange={() => console.log("Changed")}>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-end">
                <Button variant="ghost" className="px-4 py-2">
                  <Icons.moreHorizontal className="w-4 h-4 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{row.original.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/projects/${row.original.projectKey}/teams`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Icons.users className="w-4 h-4 mr-2" />
                    <span>Teams</span>
                  </DropdownMenuItem>
                </Link>
                <Link href={`/projects/${row.original.projectKey}/issues`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Icons.details className="w-4 h-4 mr-2" />
                    <span>Issues</span>
                  </DropdownMenuItem>
                </Link>
                <Link href={`/projects/${row.original.projectKey}/timeline`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Icons.calendar className="w-4 h-4 mr-2" />
                    <span>Timeline</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  {/* TODO: Fix project delete button's background on hover */}
                  <DropdownMenuItem className="cursor-pointer text-destructive hover:font-medium">
                    <Icons.trash className="w-4 h-4 mr-2" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
              <AlertDialogContent className="max-w-[95vw] rounded-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this project and its saved data from your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteProject(row.original.id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </DropdownMenu>
          </AlertDialog>
        </div>
      )
    },
  },
]

const ProjectsTable = ({
  data,
  isLoading,
}: {
  data: ProjectWithFullLead[] | null
  isLoading: boolean
}) => {
  return (
    <Shell variant={"none"}>
      <DataTable
        filterBy="name"
        isLoading={isLoading}
        columns={projectColumns}
        data={data ?? ([] as ProjectWithFullLead[])}
      />
    </Shell>
  )
}

export default ProjectsTable
