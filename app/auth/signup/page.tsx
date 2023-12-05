"use client"

import { useState } from "react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SignUpForm from "@/components/forms/signup-form"
import OAuthSignIn from "@/components/oauth-signin"
import { Shell } from "@/components/shell"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Shell className="flex items-center">
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
          <SignUpForm isLoading={isLoading} setIsLoading={setIsLoading} />
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
    </Shell>
  )
}
