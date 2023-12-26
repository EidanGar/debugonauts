"use client"

import { createContext } from "react"
import Image from "next/image"
import {
  QueryClient,
  UseMutateFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { useSession } from "next-auth/react"

import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

import {
  UserAccount,
  getUserAccount,
  setUserAccountPatch,
} from "../api/users/[userId]/route"
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

export type UserAccountContextType = {
  userAccount: UserAccount | null
  setUserAccount: UseMutateFunction<
    UserAccount | null,
    Error,
    UserAccount,
    unknown
  >
}

export const AccountContext = createContext<UserAccountContextType>({
  userAccount: null,
  setUserAccount: async () => {},
})

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient()
  const { data: session } = useSession()
  const { toast } = useToast()
  const { data: userAccount, status } = useQuery<UserAccount>({
    queryKey: ["userAccount"],
    queryFn: () => getUserAccount(session?.user?.id!),
    enabled: !!session?.user?.id,
    staleTime: Infinity,
  })

  const { mutate: setUserAccount } = useMutation({
    mutationFn: setUserAccountPatch(session?.user?.id!),
    onSuccess(data) {
      queryClient.setQueryData(["userAccount"], data)
      toast({
        title: "Account successfuly updated",
        description:
          "Your account has been updated, it will take some time to see the changes.",
      })
    },
    onError(error) {
      toast({
        title: error.name ?? "Something went wrong",
        description: error.message,
      })
    },
  })

  // TODO: Settings doesn't render on smaller screens
  return (
    <AccountContext.Provider
      value={{
        userAccount: (userAccount as UserAccount) ?? null,
        setUserAccount,
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
      <div className="hidden p-10 pb-16 space-y-6 md:block">
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
          <div className="relative flex-1 lg:max-w-2xl">
            {status === "pending" ? <Loading /> : children}
          </div>
        </div>
      </div>
    </AccountContext.Provider>
  )
}

export default SettingsLayout
