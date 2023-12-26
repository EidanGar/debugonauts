"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export const SidebarNav = ({ className, items, ...props }: SidebarNavProps) => {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex md:justify-normal w-full justify-evenly lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            pathname === item.href
              ? "bg-muted hover:bg-muted no-underline px-4 py-2"
              : "hover:bg-transparent p-0 hover:underline",
            "justify-start md:px-4 md:py-2 underline-offset-4 md:underline-offset-0 md:hover:no-underline hover:underline text-primary"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
