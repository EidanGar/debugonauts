"use client"

import Link from "next/link"

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

interface ProjectProps {
  title: string
  description: string
}

interface MoreProjectOptionsProps {
  title: string
}

const MoreProjectOptions = ({ title }: MoreProjectOptionsProps) => (
  <AlertDialog onOpenChange={() => console.log("Changed")}>
    <DropdownMenu>
      <DropdownMenuTrigger>More</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/projects/${slugify(title)}/team`}>
          <DropdownMenuItem className="cursor-pointer">
            <Icons.users className="w-4 h-4 mr-2" />
            <span>Team</span>
          </DropdownMenuItem>
        </Link>
        <Link href={`/projects/${slugify(title)}/details`}>
          <DropdownMenuItem className="cursor-pointer">
            <Icons.details className="w-4 h-4 mr-2" />
            <span>Details</span>
          </DropdownMenuItem>
        </Link>
        <Link href={`/projects/${slugify(title)}/timeline`}>
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
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </DropdownMenu>
  </AlertDialog>
)

const ProjectCard = ({ description, title }: ProjectProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{truncate(description, 100)}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <MoreProjectOptions title={title} />
        <Link
          className={buttonVariants({ size: "sm" })}
          href={`/projects/${slugify(title)}`}
        >
          View
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
