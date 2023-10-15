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
  //   metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: "Sign Up",
  description: "Create your account",
}

const RegistrationPage = () => {
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
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <SignUpForm />
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          <span className="mr-1 hidden sm:inline-block">
            Already have an account?
          </span>
          <Link
            aria-label="Login"
            href="/login"
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default RegistrationPage
