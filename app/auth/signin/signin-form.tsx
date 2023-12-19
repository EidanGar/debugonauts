"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { UserSignInData, userSignInSchema } from "@/app/auth/signin/signin"

const SignInForm = () => {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<UserSignInData>({
    resolver: zodResolver(userSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleUserLogin: SubmitHandler<UserSignInData> = async (
    data: UserSignInData
  ) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 15000)

    const callbackUrl = decodeURIComponent(
      searchParams.get("callbackUrl") ?? "/"
    )

    const response = await signIn("credentials", {
      ...data,
      callbackUrl,
    })

    if (response && !response?.ok) {
      toast({
        title: response?.error ?? "Something went wrong",
        description: JSON.stringify({ response, data }, null, 2),
      })
      return
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={(...args) => void form.handleSubmit(handleUserLogin)(...args)}
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="placeholder@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" isPrivateable={true} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} isLoading={isLoading} type="submit">
          Continue
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  )
}

export default SignInForm
