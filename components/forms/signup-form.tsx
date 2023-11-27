"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"

import { generateVerificationCode } from "@/lib/utils"
import { UserSignUpData, userSignUpSchema } from "@/lib/validations/signup"
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
import { SignUpData } from "@/components/auth-context"

interface SignInFormProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setAuthData: React.Dispatch<React.SetStateAction<SignUpData>>
  isLoading: boolean
}

const SignUpForm = ({
  setAuthData,
  setIsLoading,
  isLoading,
}: SignInFormProps) => {
  const form = useForm<UserSignUpData>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      email: "",
      username: "",
    },
  })

  const handleUserLogin: SubmitHandler<UserSignUpData> = (
    data: UserSignUpData
  ) => {
    setAuthData({
      email: data.email,
      username: data.username,
      verificationCode: generateVerificationCode(),
    })
    setIsLoading(true)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={(...args) => void form.handleSubmit(handleUserLogin)(...args)}
      >
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button disabled={isLoading} isLoading={isLoading} type="submit">
          Continue
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  )
}

export default SignUpForm
