"use client"

import * as React from "react"
import Link from "next/link"

import { NavItem as NavItemType } from "@/types/nav"
import Logo from "@/components/ui/logo"
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

import NavItem from "./ui/nav-item"

interface MainNavProps {
  items?: NavItemType[]
}

export function MainNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[300px] flex-col gap-3 p-4">
              <NavItem id="search" title="View projects" href="/pojects">
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

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Logo />
      <MainNavigationMenu />
    </div>
  )
}
