import { Metadata } from "next"
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
import { OAuthSignUp } from "@/components/oauth-signup"

export const metadata: Metadata = {
  metadataBase: new URL(process?.env?.NEXT_PUBLIC_SITE_URL ?? "localhost:3000"),
  title: "Sign Up",
  description: "Create your account",
}

export default function SignUpPage() {
  return (
    <Card className="mx-auto" style={{ width: "min(460px, 90vw)" }}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign up</CardTitle>
        <CardDescription>Choose your preferred sign up method</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <OAuthSignUp />
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
        <SignUpForm />
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          <span className="hidden mr-1 sm:inline-block">
            Already have an account?
          </span>
          <Link
            aria-label="Login"
            href="/login"
            className="transition-colors text-primary underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
