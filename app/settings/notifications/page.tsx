"use client"

import { useContext } from "react"
import { Account } from "@prisma/client"

import { Separator } from "@/components/ui/separator"

import { AccountContext, AccountContextType } from "../layout"
import {
  NotificationsForm,
  NotificationsFormValues,
} from "./notifications-form"

export default function SettingsNotificationsPage() {
  const { account, userId } = useContext<AccountContextType>(AccountContext)

  const defaultFormValues = {
    communication_emails: account?.commNotifs,
    marketing_emails: account?.marketingNotifs,
    social_emails: account?.socialNotifs,
    mobile: account?.mobileNotifsDiff,
    security_emails: account?.securityNotifs,
    type: account?.notifications,
  } as NotificationsFormValues

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications.
        </p>
      </div>
      <Separator />
      <NotificationsForm userId={userId} defaultValues={defaultFormValues} />
    </div>
  )
}
