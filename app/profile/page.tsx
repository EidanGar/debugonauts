"use client"

import { useSession } from "next-auth/react"

const UserProfilePage = () => {
  const { data: session } = useSession()

  return (
    <code>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </code>
  )
}

export default UserProfilePage
