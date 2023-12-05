"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"

import {
  UserSignUpData,
  UserSignUpResponse,
  userSignUpSchema,
} from "@/lib/validations/signup"
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

import { useAuth } from "../auth-context"

interface SignInFormProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
}

const SignUpForm = ({ setIsLoading, isLoading }: SignInFormProps) => {
  const { signUp, setUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<UserSignUpData>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  })

  const handleUserLogin: SubmitHandler<UserSignUpData> = async (
    data: UserSignUpData
  ) => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 10000)
    const res = (await signUp(data)) as Response

    if (!res) return

    const response = (await res.json()) as UserSignUpResponse

    if (!res.ok && response.isError) {
      setTimeout(
        () =>
          toast({
            title: response.error?.title || "Something went wrong",
            description:
              response.error?.description || "Please try again later",
          }),
        1500
      )
      if (res.status === 409) {
        setTimeout(() => router.push("/auth/signin"), 2000)
      }
      throw new Error("Something went wrong")
    }

    if (res.ok && !response.isError) {
      setUser(response.user)
      setTimeout(() => router.push("/"), 2500)
    }
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
          <span className="sr-only">Sign up</span>
        </Button>
      </form>
    </Form>
  )
}

export default SignUpForm
