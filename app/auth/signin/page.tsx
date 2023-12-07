"use client"

import { useState } from "react"
import Link from "next/link"
import { Provider } from "@prisma/client"

import { UserSignInData } from "@/lib/validations/signin"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SignInForm from "@/components/forms/signin-form"
import OAuthSignIn from "@/components/oauth-signin"
import { Shell } from "@/components/shell"
import SignInInstead from "@/components/sign-in-instead"

export default function SignInPage() {
  const [signInData, setSignInData] = useState<UserSignInData>({
    email: "",
    password: "",
  })
  const [usedProvider, setUsedProvider] = useState<Provider>(Provider.GOOGLE)
  const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Shell className="flex items-center">
      <Card className="mx-0 w-[min(460px,90vw)]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Choose your preferred sign in</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SignInInstead
            email={signInData.email || "placeholder@example.com"}
            provider={usedProvider}
            isOpen={isEmailAlreadyUsed}
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
            isLoading={isLoading}
            setIsEmailAlreadyUsed={setIsEmailAlreadyUsed}
            setUsedProvider={setUsedProvider}
            setSignInData={setSignInData}
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
    </Shell>
  )
}
