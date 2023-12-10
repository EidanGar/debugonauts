"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import UserAvatar from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import NavItem from "@/components/ui/nav-item"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

import { Shell } from "./shell"

const MainNavigationMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[300px] flex-col gap-3 p-4">
              <NavItem id="search" title="View projects" href="/projects">
                See how far you&apos;ve come and what&apos;s up next.
              </NavItem>
              <NavItem
                title="Create new project"
                id="plus"
                href="/projects/new"
              >
                Create a new a experience for your users and start another
                chapter.
              </NavItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Teams</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[300px] flex-col gap-3 p-4">
              <NavItem id="users" key="invite people" title="Invite people">
                Add people to debugonauts software and collaborate with ease
              </NavItem>
              <NavItem
                key="create team"
                title="Create a team"
                href="/teams/new"
                id="plus"
              >
                Ready to take control? Create a team to get started.
              </NavItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/your-work" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Your work
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const MainNav = () => {
  return (
    <div className="flex gap-6 md:gap-10">
      <Logo />
      <MainNavigationMenu />
    </div>
  )
}

const NavAuth = () => {
  const { status } = useSession()

  return (
    <nav className="flex items-center space-x-2">
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
        <div className="flex items-center space-x-2">
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
          <Link
            href="/auth/signup"
            className={cn(
              buttonVariants({
                size: "sm",
                className: "no-underline",
              })
            )}
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  )
}

export default NavAuth

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 hidden border-b-[1px] bg-background min-[800px]:block">
      <Shell
        as="div"
        className="flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0"
      >
        <MainNav />
        <div className="flex items-center justify-end flex-1 space-x-4">
          <NavAuth />
        </div>
      </Shell>
    </header>
  )
}
