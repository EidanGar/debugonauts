"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { SignUpData, useAuth } from "@/components/auth-context"
import AwaitingEmailVerification from "@/components/awaiting-email-verification"
import SignUpForm from "@/components/forms/signup-form"
import OAuthSignIn from "@/components/oauth-signin"
import { Shell } from "@/components/shell"

export default function SignUpPage() {
  const { setUser, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next")
  const [authData, setAuthData] = useState<SignUpData>({
    email: "",
    verificationCode: "",
    username: "",
  })
  const [isAwaitingEmailVerification, setIsAwaitingEmailVerification] =
    useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const createNewUser = async (signUpData: SignUpData) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(signUpData),
      })

      console.log("res:", res)

      if (!res.ok && res.status !== 409) {
        setTimeout(
          () =>
            toast({
              title: "Something went wrong",
              description: "Please try again later",
            }),
          1500
        )
        throw new Error("Something went wrong")
      }

      if (res.status === 409 && user === null) {
        setTimeout(() => {
          toast({
            title: "Email already in use",
            description: "Please sign in instead",
          })
        }, 1000)
        setTimeout(() => router.push("/auth/signin"), 2000)
        return
      }

      setTimeout(() => {
        setIsLoading(false)
        setIsAwaitingEmailVerification(true)
      }, 1000)

      const response = await res.json()
      console.log(response)

      if (!response?.error) {
        setUser(response)
        setTimeout(
          () =>
            toast({
              title: "Success!",
              description: "You will receive an email shortly",
            }),
          1000
        )

        setTimeout(() => router.push("/"), 2500)
      } else {
        setTimeout(
          () =>
            toast({
              title: "Something went wrong",
              description: "Please try again later",
            }),
          1500
        )
        setIsAwaitingEmailVerification(false)
        throw new Error("Something went wrong")
      }
    }

    if (authData.email && authData.username && authData.verificationCode) {
      createNewUser(authData)
    }
  }, [authData, router, setUser, toast, user])

  return (
    <Shell className="flex items-center">
      {isAwaitingEmailVerification ? (
        <AwaitingEmailVerification
          emailData={authData}
          setIsAwaitingEmailVerification={setIsAwaitingEmailVerification}
        />
      ) : (
        <Card className="mx-auto" style={{ width: "min(460px, 90vw)" }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>
              Choose your preferred sign up method
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <OAuthSignIn />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <SignUpForm
              isLoading={isLoading}
              setAuthData={setAuthData}
              setIsLoading={setIsLoading}
            />
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              <span className="hidden mr-1 sm:inline-block">
                Already have an account?
              </span>
              <Link
                aria-label="Sign in"
                href="/auth/signin"
                className="transition-colors text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </Shell>
  )
}
