"use client"

import { useContext } from "react"
import { AppearanceData } from "@/prisma/zod/appearance"

import { Separator } from "@/components/ui/separator"

import { AccountContext } from "../layout"
import { AppearanceForm } from "./appearance-form"

export default function SettingsAppearancePage() {
  const { userAccount, setUserAccount } = useContext(AccountContext)

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
        setUserAccount={setUserAccount}
        defaultValues={userAccount?.account as AppearanceData}
      />
    </div>
  )
}
