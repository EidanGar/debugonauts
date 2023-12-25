"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

const BreadCrumbs = () => {
  const pathname = usePathname()

  const crumbs = pathname.split("/").filter((crumb) => crumb !== "")

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 duration-300 hover:opacity-80 dark:text-gray-400 dark:hover:text-white"
          >
            <Home className="w-3 h-3 me-2.5" />
            Home
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const href = `/${crumbs.slice(0, index + 1).join("/")}`

          return (
            <li key={crumb} className="inline-flex items-center">
              <ChevronRight className="w-3 h-3 me-2.5" />
              <Link
                className="inline-flex items-center text-sm font-medium text-gray-700 duration-300 hover:opacity-80 dark:text-gray-400 dark:hover:text-white"
                href={href}
              >
                {crumb}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default BreadCrumbs
