import "@/styles/globals.css"
import { Metadata } from "next"
import { Roboto } from "next/font/google"
import { getServerSession } from "next-auth"

import { siteConfig } from "@/lib/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import MobileHeader from "@/components/mobile-header"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import SessionProvider from "@/app/session-provider"
import { ThemeProvider } from "@/app/theme-provider"

import QueryProvider from "./query-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/debugonauts.svg",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
})

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession()

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable ?? roboto.className
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryProvider>
              <Toaster />
              <SessionProvider session={session}>
                <main className="relative h-full w-full flex flex-col min-h-screen">
                  <SiteHeader />
                  <MobileHeader />
                  <div className="flex-1 w-full items-center">{children}</div>
                </main>
              </SessionProvider>
            </QueryProvider>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
