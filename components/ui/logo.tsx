import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <Icons.logo className="w-6 h-6" />
    <span className="inline-block font-bold">{siteConfig.name}</span>
  </Link>
)

export default Logo
