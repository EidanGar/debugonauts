import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface LogoProps {
  containerClassName?: string
  iconOnly?: boolean
  iconClassName?: string
  textClassName?: string
}

const Logo = ({
  iconClassName,
  iconOnly,
  textClassName,
  containerClassName,
}: LogoProps) => (
  <Link
    href="/"
    className={cn("flex items-center space-x-2", containerClassName)}
  >
    <Icons.logo className={cn("w-6 h-6", iconClassName)} />
    {!iconOnly && (
      <span className={cn("inline-block font-bold", textClassName)}>
        {siteConfig.name}
      </span>
    )}
  </Link>
)

export default Logo
