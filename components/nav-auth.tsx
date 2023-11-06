"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import UserAvatar from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

const NavAuth = () => {
  const { user } = useAuth()

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
      {user ? (
        <UserAvatar {...user} />
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
