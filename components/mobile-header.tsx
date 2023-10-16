import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import MobileSidebar from "@/components/mobile-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const MobileHeader = () => {
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
      </div>
    </section>
  )
}

export default MobileHeader