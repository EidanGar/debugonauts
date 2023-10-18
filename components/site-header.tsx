import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/main-nav"
import NavAuth from "@/components/nav-auth"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 hidden border-b-[1px] bg-background min-[800px]:block">
      <div className="container flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center justify-end flex-1 space-x-4">
          <NavAuth />
        </div>
      </div>
    </header>
  )
}
