"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface ProjectNavLink {
  title: string
  variant: "default" | "ghost"
  Icon: React.FC<LucideProps>
}

interface NavProps {
  isCollapsed: boolean
  projectKey: string
}

const ProjectNav = ({ isCollapsed, projectKey }: NavProps) => {
  const pathname = usePathname()
  const projectLinks: ProjectNavLink[] = [
    {
      title: "Board",
      Icon: Icons.board,
      variant: pathname !== `/projects/${projectKey}` ? "ghost" : "default",
    },
    {
      title: "Teams",
      Icon: Icons.users,
      variant:
        pathname !== `/projects/${projectKey}/team` ? "ghost" : "default",
    },
    {
      title: "Issues",
      Icon: Icons.details,
      variant:
        pathname !== `/projects/${projectKey}/details` ? "ghost" : "default",
    },
    {
      title: "Timeline",
      Icon: Icons.calendar,
      variant:
        pathname !== `/projects/${projectKey}/timeline` ? "ghost" : "default",
    },
    {
      title: "Settings",
      Icon: Icons.settings,
      variant:
        pathname !== `/projects/${projectKey}/settings` ? "ghost" : "default",
    },
  ]

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:px-2">
        {projectLinks.map(({ Icon, variant, title }, index) => {
          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/${projectKey}/${title.toLowerCase()}`}
                  className={cn(
                    buttonVariants({ variant, size: "icon" }),
                    "h-8 w-8",
                    variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="sr-only">{title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant, size: "sm" }),
                variant === "default" && "dark:bg-muted dark:text-white",
                "justify-start"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default ProjectNav
