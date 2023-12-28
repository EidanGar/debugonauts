import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

const NotFoundPage = () => {
  return (
    <section className="w-full bg-background">
      <div className="container flex items-center h-[80vh] px-8 sm:px-16 py-12 mx-auto">
        <div>
          <p className="text-sm font-semibold">404 error</p>
          <h1 className="mt-3 text-2xl font-semibold text-primary md:text-3xl">
            We {"can’t"} find that page
          </h1>
          <p className="mt-4 text-muted-foreground">
            Sorry, the page you are looking for {"doesn't"} exist or has been
            moved.
          </p>

          <div className="flex items-center mt-6 gap-x-3">
            <Link
              href=".."
              className={buttonVariants({
                variant: "ghost",
                className: "flex items-center gap-3",
              })}
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              <span>Go back</span>
            </Link>

            <Link href="/" className={buttonVariants()}>
              Take me home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage
