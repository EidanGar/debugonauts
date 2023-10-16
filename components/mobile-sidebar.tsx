"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button, buttonVariants } from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

const NavSheet = ({ children }: { children: React.ReactNode }) => (
  <Sheet key={"left"}>
    <SheetTrigger asChild>
      <Button variant="outline" className="w-10 h-10 p-2">
        <Icons.menu className="w-5 h-5" />
        <span className="sr-only">Menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side={"left"}>
      <SheetHeader className="mb-5">
        <SheetTitle>
          <Logo />
        </SheetTitle>
      </SheetHeader>
      {children}
    </SheetContent>
  </Sheet>
)

const MobileSidebarContent = () => (
  <Accordion type="multiple">
    <AccordionItem value="projects">
      <AccordionTrigger className="text-bold">Projects</AccordionTrigger>
      <AccordionContent>
        <ul className="flex flex-col items-start w-full gap-2">
          <li>
            <Link
              className={buttonVariants({ variant: "link" })}
              href="/projects"
            >
              View projects
            </Link>
          </li>
          <li>
            <Link
              className={buttonVariants({ variant: "link" })}
              href="/projects/new"
            >
              Create new project
            </Link>
          </li>
        </ul>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="teams">
      <AccordionTrigger className="text-bold">Teams</AccordionTrigger>
      <AccordionContent>
        <ul className="flex flex-col items-start w-full gap-2">
          <li className={buttonVariants({ variant: "link" })}>Invite people</li>
          <li>
            <Link
              className={buttonVariants({ variant: "link" })}
              href="/teams/new"
            >
              Create a team
            </Link>
          </li>
        </ul>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const MobileSidebar = () => {
  return (
    <NavSheet>
      <MobileSidebarContent />
      <Link
        className={cn(buttonVariants({ variant: "link" }), "p-0 mt-3")}
        href="/your-work"
      >
        Your work
      </Link>
    </NavSheet>
  )
}

export default MobileSidebar
