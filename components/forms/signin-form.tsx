"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"

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
import { useAuth } from "@/components/auth-context"

const SignInForm = () => {
  const { signIn } = useAuth()
  const router = useRouter()
  const form = useForm<UserSignInData>({
    resolver: zodResolver(userSignInSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleUserLogin: SubmitHandler<UserSignInData> = async (
    data: UserSignInData
  ) => {
    try {
      await signIn(data)
    } catch (error) {
      console.error(error)
    } finally {
      router.push("/")
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
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  )
}

export default SignInForm
