"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import UserAvatar from "@/components/ui/avatar"
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
import { ThemeToggle } from "@/components/theme-toggle"

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

const MobileHeader = () => {
  const { status } = useSession()

  return (
    <section className="px-[calc(10vw/2)] bg-background border-b-[1px] sticky top-0 z-40 flex items-center justify-between h-16 py-2 min-[800px]:hidden">
      <MobileSidebar />
      <div className="flex items-center justify-end flex-1 space-x-4">
        <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
          <div
            className={buttonVariants({
              size: "icon",
              variant: "ghost",
            })}
          >
            <Icons.gitHub className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </div>
        </Link>
        <ThemeToggle />
        {status === "authenticated" ? (
          <UserAvatar />
        ) : (
          <Link
            href="/auth/signin"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
                className: "no-underline",
              })
            )}
          >
            Sign in
          </Link>
        )}
      </div>
    </section>
  )
}

export default MobileHeader
