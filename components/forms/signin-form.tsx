"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Provider, User } from "@prisma/client"
import { SubmitHandler, useForm } from "react-hook-form"

import {
  SignInResponse,
  UserSignInData,
  userSignInSchema,
} from "@/lib/validations/signin"
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
import { useAuth } from "@/components/auth-context"

interface SignInFormProps {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setIsEmailAlreadyUsed: React.Dispatch<React.SetStateAction<boolean>>
  setUsedProvider: React.Dispatch<React.SetStateAction<Provider>>
  setSignInData: React.Dispatch<React.SetStateAction<UserSignInData>>
}

const SignInForm = ({
  isLoading,
  setIsLoading,
  setIsEmailAlreadyUsed,
  setUsedProvider,
  setSignInData,
}: SignInFormProps) => {
  const router = useRouter()
  const { toast } = useToast()
  const { signIn, setUser } = useAuth()
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
    setSignInData(data)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 10000)
    const res = await signIn(data)

    if (!res) return

    const response = (await res.json()) as SignInResponse

    if (!res.ok && response.isError) {
      setTimeout(
        () =>
          toast({
            title: response.error?.title ?? "Error",
            description: response.error?.description ?? "Something went wrong",
          }),
        1500
      )
      if (res.status === 409) {
        setIsEmailAlreadyUsed(true)
        setUsedProvider(response?.provider ?? Provider.GOOGLE)
      }
      return
    }

    setUser(response.user as User)
    router.push("/")
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
