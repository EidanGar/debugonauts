"use client"

import Link from "next/link"
import { Icon, LucideIcon, LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface ProjectNavLink {
  title: string
  label?: string
  Icon: Icon | ((arg: LucideProps) => JSX.Element)
  variant: "default" | "ghost"
}

interface NavProps {
  isCollapsed: boolean
  links: ProjectNavLink[]
  projectKey: string
}

export const ProjectNav = ({ links, isCollapsed, projectKey }: NavProps) => {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/${projectKey}/${link.title}`}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-8 w-8",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground"
                  )}
                >
                  {/* TODO: Fix project sidebar's icon rendering */}
                  {/* <link.Icon className="h-4 w-4" /> */}
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" && "dark:bg-muted dark:text-white",
                "justify-start"
              )}
            >
              {/* <link.Icon className="mr-2 h-4 w-4" /> */}
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}
