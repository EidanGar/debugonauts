import React from "react"

import { cn } from "@/lib/utils"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Icons } from "@/components/icons"

const TitleWithIcon = ({ id, title }: { id: string; title: string }) => {
  const Icon = Icons[id]

  return (
    <div className="flex items-center gap-2 pb-1">
      <Icon className="w-5 h-5" />
      <div className="text-sm font-medium leading-none">{title}</div>
    </div>
  )
}

const NavItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, id, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          {(id ?? "") in Icons ? (
            <TitleWithIcon id={id!} title={title ?? "Title here"} />
          ) : (
            <div className="text-sm font-medium leading-none">{title}</div>
          )}
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})

NavItem.displayName = "ListItem"

export default NavItem
