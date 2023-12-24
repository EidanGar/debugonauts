"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon, LucideIcon, LucideProps } from "lucide-react"

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
  label?: string
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
      title: "board",
      label: "Board",
      Icon: Icons.board,
      variant: pathname === `/projects/${projectKey}` ? "ghost" : "default",
    },
    {
      title: "teams",
      label: "Teams",
      Icon: Icons.users,
      variant:
        pathname === `/projects/${projectKey}/team` ? "ghost" : "default",
    },
    {
      title: "issues",
      label: "Issues",
      Icon: Icons.details,
      variant:
        pathname === `/projects/${projectKey}/details` ? "ghost" : "default",
    },
    {
      title: "timeline",
      label: "Timeline",
      Icon: Icons.calendar,
      variant:
        pathname === `/projects/${projectKey}/timeline` ? "ghost" : "default",
    },
    {
      title: "settings",
      label: "Settings",
      Icon: Icons.settings,
      variant:
        pathname === `/projects/${projectKey}/settings` ? "ghost" : "default",
    },
  ]

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:px-2">
        {projectLinks.map(({ Icon, title, variant, label }, index) => {
          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/${projectKey}/${title}`}
                  className={cn(
                    buttonVariants({ variant, size: "icon" }),
                    "h-8 w-8",
                    variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground"
                  )}
                >
                  {/* TODO: Fix project sidebar's icon rendering */}
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {title}
                {label && (
                  <span className="ml-auto text-muted-foreground">{label}</span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: variant, size: "sm" }),
                variant === "default" && "dark:bg-muted dark:text-white",
                "justify-start"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {title}
              {label && (
                <span
                  className={cn(
                    "ml-auto",
                    variant === "default" && "text-background dark:text-white"
                  )}
                >
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default ProjectNav
