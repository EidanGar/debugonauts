"use client"

import { useContext } from "react"
import { Account } from "@prisma/client"

import { Separator } from "@/components/ui/separator"

import { AccountContext, AccountContextType } from "../layout"
import { AccountForm, AccountFormValues } from "./account-form"

export default function SettingsAccountPage() {
  const { account, userId } = useContext<AccountContextType>(AccountContext)

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
        userId={userId}
        defaultValues={account as AccountFormValues}
      />
    </div>
  )
}
