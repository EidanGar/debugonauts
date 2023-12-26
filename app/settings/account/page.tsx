"use client"

import { useContext } from "react"
import { AccountData } from "@/prisma/zod/account"

import { Separator } from "@/components/ui/separator"

import { AccountContext } from "../layout"
import { AccountForm } from "./account-form"

export default function SettingsAccountPage() {
  const { userAccount, setUserAccount } = useContext(AccountContext)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <AccountForm
        setUserAccount={setUserAccount}
        defaultValues={userAccount?.account as AccountData}
      />
    </div>
  )
}
