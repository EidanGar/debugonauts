"use client"

import Link from "next/link"
import { Project } from "@prisma/client"

import { slugify, truncate } from "@/lib/utils"
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
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

import { useToast } from "./ui/use-toast"

const MoreProjectOptions = ({ name, id }: Project) => {
  const { toast } = useToast()

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

    if (res.status !== 200) {
      toast(response.error)
      return
    }

    toast({
      title: `Project "${name}" deleted`,
    })
  }

  return (
    <AlertDialog onOpenChange={() => console.log("Changed")}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.moreHorizontal className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/projects/${slugify(name)}/team`}>
            <DropdownMenuItem className="cursor-pointer">
              <Icons.users className="w-4 h-4 mr-2" />
              <span>Team</span>
            </DropdownMenuItem>
          </Link>
          <Link href={`/projects/${slugify(name)}/details`}>
            <DropdownMenuItem className="cursor-pointer">
              <Icons.details className="w-4 h-4 mr-2" />
              <span>Details</span>
            </DropdownMenuItem>
          </Link>
          <Link href={`/projects/${slugify(name)}/timeline`}>
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
              This action cannot be undone. This will permanently delete this
              project and its saved data from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteProject(id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  )
}

const ProjectCard = (project: Project) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{truncate(project.description, 100)}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <MoreProjectOptions {...project} />
        <Link
          className={buttonVariants({ size: "sm" })}
          href={`/projects/${slugify(project.name)}`}
        >
          View
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
