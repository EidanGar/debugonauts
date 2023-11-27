"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Provider, User } from "@prisma/client"

import { SignInResoponse } from "@/lib/validations/signin"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { EmailData, useAuth } from "@/components/auth-context"
import AwaitingEmailVerification from "@/components/awaiting-email-verification"
import SignInForm from "@/components/forms/signin-form"
import OAuthSignIn from "@/components/oauth-signin"
import { Shell } from "@/components/shell"
import SignInInstead from "@/components/sign-in-instead"

export default function Auth() {
  const router = useRouter()
  const { setUser, user } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next")
  const [emailData, setEmailData] = useState<EmailData>({
    email: "",
    verificationCode: "",
  })
  const [isAwaitingEmailVerification, setIsAwaitingEmailVerification] =
    useState(false)
  const [usedProvider, setUsedProvider] = useState<Provider>(Provider.GOOGLE)
  const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const authenticateUser = async (data: EmailData) => {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify(data),
      })

      if (res.ok) setIsAwaitingEmailVerification(true)

      const response: SignInResoponse = await res.json()

      if (!res.ok && res.status !== 409 && res.status !== 403) {
        setTimeout(
          () =>
            toast({
              title: response.title,
              description: response.description,
            }),
          1500
        )
        throw new Error("Something went wrong")
      }

      if (res.status === 403) {
        setTimeout(
          () =>
            toast({
              title: response.title,
              description: response.description,
            }),
          1500
        )
        return
      }

      if (res.status === 409 && user === null) {
        setIsEmailAlreadyUsed(true)
        setUsedProvider(response.provider)
        return
      }

      setUser(response)
      router.push("/")
    }

    if (isLoading && emailData.email) authenticateUser(emailData)
  }, [router, setUser, toast, user, emailData, isLoading])

  return (
    <Shell className="flex items-center">
      {isAwaitingEmailVerification && !isEmailAlreadyUsed ? (
        <AwaitingEmailVerification
          emailData={emailData}
          setIsAwaitingEmailVerification={setIsAwaitingEmailVerification}
        />
      ) : (
        <Card className="mx-auto" style={{ width: "min(460px, 90vw)" }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Choose your preferred sign in</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <SignInInstead
              email={emailData.email || "placeholder@example.com"}
              provider={usedProvider}
              isOpen={isEmailAlreadyUsed}
              setIsAwaitingEmailVerification={setIsAwaitingEmailVerification}
            />
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
            <SignInForm
              setIsLoading={setIsLoading}
              setEmailData={setEmailData}
              isLoading={isLoading}
            />
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              <span className="hidden mr-1 sm:inline-block">
                Don&apos;t have an account?
              </span>
              <Link
                aria-label="Sign up"
                href="/auth/signup"
                className="transition-colors text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>

            <Link
              aria-label="Recover account"
              href="/auth/signin/recovery"
              className="text-sm transition-colors text-primary underline-offset-4 hover:underline"
            >
              Can&apos;t sign in?
            </Link>
          </CardFooter>
        </Card>
      )}
    </Shell>
  )
}
