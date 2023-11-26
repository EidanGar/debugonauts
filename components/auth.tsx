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
import { AuthType, EmailData } from "@/components/auth-context"
import AwaitingEmailVerification from "@/components/awaiting-email-verification"
import SignInForm from "@/components/forms/signin-form"
import OAuthSignIn from "@/components/oauth-signin"
import { Shell } from "@/components/shell"
import SignInInstead from "@/components/sign-in-instead"

interface AuthProps {
  authType: AuthType
}

export default function Auth({ authType }: AuthProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next")
  const [emailData, setEmailData] = useState<EmailData>({
    emailAddress: "",
    verificationCode: "",
  })
  const [isAwaitingEmailVerification, setIsAwaitingEmailVerification] =
    useState(false)
  const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = useState(true)

  useEffect(() => {
    if (isAwaitingEmailVerification) {
      /*
      await handleUserSignIn with authType "signup"
      
      if (!res.ok) {
        handle error
        throw warning with toast and send user back to their auth page
        router.push(`/auth/${authType}`)
        throw new Error("Something went wrong")
      }
      
      if (response?.error) {
        handle error
        if status code is 409
        if the auth type is signup redirect them to the signin page
        else if the auth type is signin
        tell the user that that email is already in use by x provider
        then ask if they want to sign in with their other auth method instead
      }
      */
    }
  }, [isAwaitingEmailVerification, isEmailAlreadyUsed, authType])

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
            <CardTitle className="text-2xl">
              Sign {authType === AuthType.SignIn ? "in" : "up"}
            </CardTitle>
            <CardDescription>
              Choose your preferred sign{" "}
              {authType === AuthType.SignIn ? "in" : "up"} method
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <SignInInstead
              emailAddress={emailData.emailAddress || "placeholder@example.com"}
              provider="google"
              isOpen={
                isEmailAlreadyUsed &&
                authType === AuthType.SignIn &&
                isAwaitingEmailVerification
              }
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
              setEmailData={setEmailData}
              setIsAwaitingEmailVerification={setIsAwaitingEmailVerification}
            />
          </CardContent>
          {authType === AuthType.SignUp ? (
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
          ) : (
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
          )}
        </Card>
      )}
    </Shell>
  )
}
