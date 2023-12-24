"use client"

import { createContext, useEffect, useState } from "react"
import Image from "next/image"
import { Account } from "@prisma/client"
import { useSession } from "next-auth/react"

import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

import { FetchAccountResponse } from "../api/users/[userId]/account/route"
import Loading from "../loading"
import { SidebarNav } from "./sidebar-nav"

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Account",
    href: "/settings/account",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
]

export type AccountContextType = {
  account: Account | null
  userId: string | null
}

export const AccountContext = createContext<AccountContextType>({
  account: null,
  userId: null,
})

interface SettingsLayoutProps {
  children: React.ReactNode
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const [userAccount, setUserAccount] = useState<Account | null>(null)
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    const fetchAccountInfo = async () => {
      // @ts-ignore
      const response = await fetch(`/api/users/${session?.user?.id}/account`)
      const data: FetchAccountResponse = await response.json()

      setUserAccount(data.account)
    }

    // @ts-ignore
    if (session?.user?.id) fetchAccountInfo()
    // @ts-ignore
  }, [session?.user?.id])

  const setAccount = (userId: string) => {
    return async (account: Partial<Account>) => {
      console.log("New account info:", account)

      const response = await fetch(`/api/users/${userId}/account`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      })

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Something went wrong, try again later.",
        })
        return
      }

      const data: FetchAccountResponse = await response.json()

      if (data.isError && !data.account) {
        toast({
          title: data.error?.title,
          description: data.error?.description,
        })
        return
      }

      toast({
        title: "Account successfuly updated",
        description:
          "Your account has been updated, it will take some time to see the changes.",
      })
    }
  }

  return (
    <AccountContext.Provider
      value={{
        account: userAccount,
        // @ts-ignore
        userId: session?.user?.id,
      }}
    >
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl relative">
            {/* @ts-ignore */}
            {session?.user?.id ? children : <Loading />}
          </div>
        </div>
      </div>
    </AccountContext.Provider>
  )
}

export default SettingsLayout
