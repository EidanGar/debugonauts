"use client"

import { useContext } from "react"
import { Account } from "@prisma/client"

import { Separator } from "@/components/ui/separator"

import { AccountContext, AccountContextType } from "../layout"
import { AppearanceForm, AppearanceFormValues } from "./appearance-form"

export default function SettingsAppearancePage() {
  const { account, userId } = useContext<AccountContextType>(AccountContext)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator />
      <AppearanceForm
        userId={userId}
        defaultValues={
          {
            font: account?.fontPreference,
            theme: account?.themePreference,
          } as AppearanceFormValues
        }
      />
    </div>
  )
}
