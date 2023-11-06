"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"

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
import { useAuth } from "@/components/auth-context"

const SignUpForm = () => {
  const { signUp } = useAuth()
  const router = useRouter()
  const form = useForm<UserSignUpData>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const handleUserRegistration: SubmitHandler<UserSignUpData> = async (
    data: UserSignUpData
  ) => {
    try {
      await signUp(data)
    } catch (error) {
      console.error(error)
    } finally {
      router.push("/")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(...args) =>
          void form.handleSubmit(handleUserRegistration)(...args)
        }
        className="flex flex-col w-full gap-4"
      >
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Username" {...field} />
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
                <Input type="email" placeholder="Email" {...field} />
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
                <Input
                  type="password"
                  isPrivateable={true}
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          Sign up
          <span className="sr-only">Sign up</span>
        </Button>
      </form>
    </Form>
  )
}

export default SignUpForm
