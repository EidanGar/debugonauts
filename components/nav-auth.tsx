import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { Icons } from "./icons"
import { ThemeToggle } from "./theme-toggle"
import UserAvatar from "./ui/avatar"
import { buttonVariants } from "./ui/button"

interface NavAuthProps {
  isLoggedIn?: boolean
}

const NavAuth = ({ isLoggedIn = true }: NavAuthProps) => {
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
      {isLoggedIn ? (
        <UserAvatar name="bob" email="bobby@email.com" />
      ) : (
        <div className="flex items-center space-x-2">
          <Link
            href="/login"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
                className: "no-underline",
              })
            )}
          >
            Log in
          </Link>
          <Link
            href="/signup"
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
