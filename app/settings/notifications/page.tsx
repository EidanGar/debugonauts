"use client"

import { useContext } from "react"
import { NotificationsData } from "@/prisma/zod/notifications"

import { Separator } from "@/components/ui/separator"

import { AccountContext } from "../layout"
import { NotificationsForm } from "./notifications-form"

export default function SettingsNotificationsPage() {
  const { userAccount, setUserAccount } = useContext(AccountContext)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications.
        </p>
      </div>
      <Separator />
      <NotificationsForm
        setUserAccount={setUserAccount}
        defaultValues={{ ...userAccount?.account } as NotificationsData}
      />
    </div>
  )
}
