import Image from "next/image"
import Link from "next/link"
import { Project } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { userConfig } from "@/config/user"
import { capitalize, slugify } from "@/lib/utils"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"

import DataTable from "../../components/ui/data-table"
import Loading from "../loading"

export type ProjectWithLead = Project & {
  leadName: string
  leadImage: string
}

const projectColumns: ColumnDef<ProjectWithLead>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Link
        className="underline-offset-4 hover:underline text-primary"
        style={{
          padding: 0,
        }}
        href={`/projects/${slugify(row.original.name)}`}
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    cell: ({ row }) => {
      return <span>{capitalize(row.original.visibility)}</span>
    },
  },
  {
    accessorKey: "projectLeadId",
    header: "Lead",
    cell: ({ row }) => {
      return (
        <div className="flex items-center h-full gap-2">
          <Image
            className="inline-block w-7 h-7 mr-2 rounded-full"
            width={28}
            height={28}
            src={row.original.leadImage ?? userConfig.defaultUserImage}
            alt={row.original.leadName}
          />
          <span>{row.original.leadName}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteProject = async (id: string) => {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: id,
          }),
        })

        const response = await res.json()

        if (res.status !== 200 || response.isError) {
          throw new Error(response.message)
        }
      }

      const slugifiedName = slugify(row.original.name)

      return (
        <AlertDialog onOpenChange={() => console.log("Changed")}>
          <DropdownMenu>
            {/* TODO: Fix project options styles in projects page */}
            <DropdownMenuTrigger>
              <Icons.moreHorizontal className="w-4 h-4 ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{row.original.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/projects/${slugifiedName}/team`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Icons.users className="w-4 h-4 mr-2" />
                  <span>Team</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/projects/${slugifiedName}/details`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Icons.details className="w-4 h-4 mr-2" />
                  <span>Details</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/projects/${slugifiedName}/timeline`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Icons.calendar className="w-4 h-4 mr-2" />
                  <span>Timeline</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-pink-500 cursor-pointer hover:text-pink-600">
                  <Icons.trash className="w-4 h-4 mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
            <AlertDialogContent>
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
      )
    },
  },
]

const ProjectsTable = ({ data }: { data: Project[] }) => {
  return data?.length ? (
    <Shell variant={"none"}>
      {/* @ts-ignore */}
      <DataTable columns={projectColumns} data={data} />
    </Shell>
  ) : (
    <Loading />
  )
}

export default ProjectsTable
