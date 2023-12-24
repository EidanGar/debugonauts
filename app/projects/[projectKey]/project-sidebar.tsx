"use client"

import { useContext, useState } from "react"

import { cn } from "@/lib/utils"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

import { ProjectContext } from "./layout"
import ProjectNav from "./project-nav"

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
  const { projectData, session } = useContext(ProjectContext)

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
          <div>
            <ProjectNav
              projectKey={projectData?.name ?? projectKey}
              isCollapsed={isCollapsed}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={70}>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}

export default ProjectSideBar
