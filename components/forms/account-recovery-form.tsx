"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"

import {
  AccountRecoveryData,
  accountRecoverySchema,
} from "@/lib/validations/account-recovery"
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

const AccountRecoveryForm = () => {
  const form = useForm<AccountRecoveryData>({
    resolver: zodResolver(accountRecoverySchema),
    defaultValues: {
      email: "",
    },
  })

  const handleResetPassword: SubmitHandler<AccountRecoveryData> = (
    data: AccountRecoveryData
  ) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={(...args) =>
          void form.handleSubmit(handleResetPassword)(...args)
        }
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
        <div className="flex items-center justify-between w-full pt-3">
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
          <Button type="submit" size="sm">
            Send link
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AccountRecoveryForm
