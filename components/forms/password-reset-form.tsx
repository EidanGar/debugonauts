"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"

import { validateSchema } from "@/lib/utils"
import {
  PasswordResetData,
  passwordResetSchema,
} from "@/lib/validations/password-reset"
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

const PasswordResetForm = () => {
  const router = useRouter()

  const form = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  })

  const handlePasswordReset: SubmitHandler<PasswordResetData> = async (
    data
  ) => {
    const schemaValidationResult = await validateSchema<PasswordResetData>(
      passwordResetSchema,
      data
    )
    if (
      "issues" in schemaValidationResult ||
      "message" in schemaValidationResult
    ) {
      throw new Error("Invalid data")
    }
    console.log(data)

    router.push("/")
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={(...args) =>
          void form.handleSubmit(handlePasswordReset)(...args)
        }
      >
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
        <FormField
          name="passwordConfirmation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" isPrivateable={true} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="sm" className="self-end mt-3">
          Reset password
        </Button>
      </form>
    </Form>
  )
}

export default PasswordResetForm
