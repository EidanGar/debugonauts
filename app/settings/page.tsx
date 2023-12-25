"use client"

import { Separator } from "@/components/ui/separator"

import ProfileForm from "./profile-form"

const SettingsProfilePage = () => {
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
      <ProfileForm />
    </div>
  )
}

export default SettingsProfilePage
