import "@/styles/globals.css"
import { Metadata } from "next"
import { getServerSession } from "next-auth"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import MobileHeader from "@/components/mobile-header"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import SessionProvider from "@/app/session-provider"
import { ThemeProvider } from "@/app/theme-provider"

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

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession()

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster />
            <SessionProvider session={session}>
              <main className="relative h-full w-full flex flex-col min-h-screen">
                <SiteHeader />
                <MobileHeader />
                <div className="flex-1 w-full mx-auto py-4 items-center max-w-6xl">
                  {children}
                </div>
              </main>
            </SessionProvider>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
