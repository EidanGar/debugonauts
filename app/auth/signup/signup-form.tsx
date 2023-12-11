"use client"

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
import {
  UserSignUpData,
  UserSignUpResponse,
  userSignUpSchema,
} from "@/app/auth/signup/signup"

interface SignInFormProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
}

const SignUpForm = ({ setIsLoading, isLoading }: SignInFormProps) => {
  const { toast } = useToast()
  const form = useForm<UserSignUpData>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  })

  const handleUserLogin: SubmitHandler<UserSignUpData> = async (
    data: UserSignUpData
  ) => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 10000)
    const createUserRes = await fetch("/api/users/new", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!createUserRes.ok) {
      setTimeout(
        () =>
          toast({
            title: "Something went wrong",
            description: "Please try again later",
          }),
        1500
      )
      throw new Error("Something went wrong")
    }

    const createUserResponse =
      (await createUserRes.json()) as UserSignUpResponse

    if (createUserResponse.isError) {
      setTimeout(
        () =>
          toast({
            title: createUserResponse.error?.title || "Something went wrong",
            description:
              createUserResponse.error?.description || "Please try again later",
          }),
        1500
      )
      throw new Error("Something went wrong")
    }

    const { email } = createUserResponse?.user

    const signInResponse = await signIn("credentials", {
      email,
      password: data.password,
      callbackUrl: "/",
    })

    if (!signInResponse || !signInResponse?.ok) {
      setTimeout(
        () =>
          toast({
            title: signInResponse?.error ?? "Something went wrong",
            description: "Please try again",
          }),
        1500
      )
      return
    }

    setTimeout(
      () =>
        toast({
          title: "Account created successfully",
          description: "Welcome to the club!",
        }),
      1500
    )
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={(...args) => void form.handleSubmit(handleUserLogin)(...args)}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
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
