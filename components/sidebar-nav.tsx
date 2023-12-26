"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon, LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    Icon?: Icon | ((arg: LucideProps) => JSX.Element)
  }[]
}

export const SidebarNav = ({ className, items, ...props }: SidebarNavProps) => {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex md:justify-normal w-full justify-between lg:flex-col lg:space-x-0 lg:space-y-1",
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
          {item.Icon && <item.Icon className="hidden w-4 h-4 mr-2 sm:block" />}
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
