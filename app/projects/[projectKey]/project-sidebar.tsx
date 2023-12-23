"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

import { ProjectNav, ProjectNavLink } from "./project-nav"
import { usePathname } from "next/navigation"
import { Icons } from "@/components/icons"

interface ProjectSidebarProps {
  defaultLayout?: number[]
  defaultCollapsed?: boolean
  navCollapsedSize: number
  children: React.ReactNode
  projectKey: string
}

const ProjectSideBar = ({
  defaultLayout = [30, 70],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
  projectKey,
}: ProjectSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed)
  const pathname = usePathname()

  const projectLinks: ProjectNavLink[] = [
    {
      title: "board",
      label: "Board",
      Icon: Icons.board,
      variant: pathname === `/projects/${projectKey}` ? "ghost" : "default",
    },
    {
      title: "team",
      label: "Team",
      Icon: Icons.users,
      variant:
        pathname === `/projects/${projectKey}/team` ? "ghost" : "default",
    },
    {
      title: "details",
      label: "Details",
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
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            isCollapsed && "transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex items-center p-2">
            <div
              className="w-full"
              // className={cn("w-full flex-1", isCollapsed ? "w-full" : "w-[80%]")}
            >
              {projectKey}
            </div>
          </div>
          <Separator />
          <div className={cn(isCollapsed ? "block" : "hidden")}>
            <ProjectNav
              projectKey={projectKey}
              isCollapsed={isCollapsed}
              links={projectLinks}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}

export default ProjectSideBar
