"use client"

import { useContext } from "react"
import { ProfileData } from "@/prisma/zod/profile"

import { Separator } from "@/components/ui/separator"

import { AccountContext } from "./layout"
import ProfileForm from "./profile-form"

const SettingsProfilePage = () => {
  const { userAccount, setUserAccount } = useContext(AccountContext)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile and visiblity</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal information, and control which information other
          people see and apps may access.
        </p>
      </div>
      <Separator />
      <ProfileForm
        setUserAccount={setUserAccount}
        defaultValues={userAccount as ProfileData}
      />
    </div>
  )
}

export default SettingsProfilePage
