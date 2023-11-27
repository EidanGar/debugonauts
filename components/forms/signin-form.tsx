"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"

import { generateVerificationCode } from "@/lib/utils"
import { UserSignInData, userSignInSchema } from "@/lib/validations/signin"
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
import { EmailData } from "@/components/auth-context"

interface SignInFormProps {
  setEmailData: React.Dispatch<React.SetStateAction<EmailData>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const SignInForm = ({
  setEmailData,
  isLoading,
  setIsLoading,
}: SignInFormProps) => {
  const form = useForm<UserSignInData>({
    resolver: zodResolver(userSignInSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleUserLogin: SubmitHandler<UserSignInData> = (
    data: UserSignInData
  ) => {
    setEmailData({
      email: data.email,
      verificationCode: generateVerificationCode(),
    })
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 10000)
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

        <Button disabled={isLoading} isLoading={isLoading} type="submit">
          Continue
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  )
}

export default SignInForm
