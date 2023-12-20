"use client"

import useAuth from "@/hooks/useAuth"

import Loading from "../loading"

export default async function A() {
  const auth = await useAuth()

  if (!auth) {
    return <Loading />
  }

  return (
    <pre>
      <code>{JSON.stringify(auth, null, 2)}</code>
    </pre>
  )
}
