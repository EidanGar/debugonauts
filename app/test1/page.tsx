"use client"

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"
import { useSession } from "next-auth/react"

import Loading from "../loading"

const queryClient = new QueryClient()

const fetchUser = async () => {
  console.time("fetchUser")
  const res = await fetch("/api/users/stuff")
  if (!res.ok) throw new Error("Something went wrong")
  console.timeEnd("fetchUser")
  return res.json()
}

const Example = () => {
  const { data: session } = useSession()
  const { data, status, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  })

  if (status === "pending") return <Loading />

  return (
    <pre className="p-4 rounded-md bg-primary-foreground">
      <code>
        {JSON.stringify(
          {
            data,
            status,
            error,
            session,
          },
          null,
          2
        )}
      </code>
    </pre>
  )
}

export default function Test1() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}
