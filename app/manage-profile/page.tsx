"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Visibility } from "@prisma/client"
import { getSession, useSession } from "next-auth/react"
import { SubmitHandler, useForm } from "react-hook-form"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"

import Loading from "../loading"
import { ProfileData, profileSchema } from "./profile"

interface ProfileVisibilityProps {
  onChange?: (value: Visibility) => void
  value: Visibility
}

const VisibilityDropdown = ({ onChange, value }: ProfileVisibilityProps) => {
  return (
    <Select
      disabled={!onChange}
      onValueChange={onChange}
      value={value === "PRIVATE" ? Visibility.PRIVATE : Visibility.PUBLIC}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={Visibility.PUBLIC}>
            <div className="flex items-center w-full gap-2">
              <Icons.earth className="w-4 h-4" />
              <span>Anyone</span>
            </div>
          </SelectItem>
          <SelectItem value={Visibility.PRIVATE}>
            <div className="flex items-center w-full gap-2">
              <Icons.lock className="w-4 h-4" />
              <span>Only you</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const ManageProfilePage = () => {
  const { toast } = useToast()
  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: async (): Promise<ProfileData> => {
      const session = await getSession()
      while (true) {
        // @ts-ignore
        if (session?.user?.id) {
          return session.user as ProfileData
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    },
  })

  const onSubmit: SubmitHandler<ProfileData> = async (data) => {
    // @ts-ignore
    const response = await fetch(`/api/users/${session?.user.id}/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data as ProfileData),
    })

    if (response.ok) {
      toast({
        title: "Your profile has been updated.",
        description: "Your change might take a while to show everywhere",
      })
    } else {
      toast({
        title: "Something went wrong",
        description: "Your profile could not be updated.",
      })
    }
  }

  // @ts-ignore
  if (!session?.user?.id) {
    return <Loading />
  }

  return (
    <Shell
      variant="none"
      as="div"
      className="flex flex-col items-start max-w-2xl gap-3 px-4 pt-2 text-left"
    >
      <h1 className="text-xl font-bold leading-tight md:text-2xl">
        Profile and visibility
      </h1>
      <p className="text-base text-muted-foreground">
        Manage your personal information, and control which information other
        people see and apps may access.
      </p>
      <Form {...form}>
        <form
          className="flex flex-col w-full gap-3"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <h2 className="text-lg font-semibold">
            Profile photo and header image
          </h2>
          <Card className="w-full">
            <CardContent className="flex flex-col w-full gap-3 p-6">
              <div className="flex flex-col items-start w-full gap-4 sm:grid sm:grid-cols-5 sm:items-end">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="w-full sm:col-span-3">
                      <FormLabel className="font-medium text-muted-foreground">
                        Profile image
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 focus:border-1 hover:bg-primary-foreground"
                          type="url"
                          required={false}
                          placeholder="https://example.com/image.png"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="sm:col-span-2">
                  <VisibilityDropdown value={Visibility.PUBLIC} />
                </FormItem>
              </div>

              <div className="flex flex-col items-start w-full gap-4 sm:grid sm:grid-cols-5 sm:items-end">
                <FormField
                  control={form.control}
                  name="bannerImage"
                  render={({ field }) => (
                    <FormItem className="w-full sm:col-span-3">
                      <FormLabel className="font-medium text-muted-foreground">
                        Header image
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 focus:border-1 hover:bg-primary-foreground"
                          type="url"
                          placeholder="https://example.com/image.png"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="sm:col-span-2">
                  <VisibilityDropdown value={Visibility.PUBLIC} />
                </FormItem>
              </div>
            </CardContent>
          </Card>
          <h2 className="mt-3 text-lg font-semibold">About you</h2>
          <Card className="w-full">
            <CardContent className="flex flex-col w-full gap-3 p-6">
              <div className="flex flex-col items-start w-full gap-4 sm:grid sm:grid-cols-5 sm:items-end">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full sm:col-span-3">
                      <FormLabel className="font-medium text-muted-foreground">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 focus:border-1 hover:bg-primary-foreground"
                          type="text"
                          placeholder="Your username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="sm:col-span-2">
                  <VisibilityDropdown value={Visibility.PUBLIC} />
                </FormItem>
              </div>
              <div className="flex flex-col items-start w-full gap-4 sm:grid sm:grid-cols-5 sm:items-end">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem className="w-full sm:col-span-3">
                      <FormLabel className="font-medium text-muted-foreground">
                        Job Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 focus:border-1 hover:bg-primary-foreground"
                          type="text"
                          placeholder="Your job title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="sm:col-span-2">
                  <VisibilityDropdown value={Visibility.PUBLIC} />
                </FormItem>
              </div>
              <div className="flex flex-col items-start w-full gap-4 sm:grid sm:grid-cols-5 sm:items-end">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="w-full sm:col-span-3">
                      <FormLabel className="font-medium text-muted-foreground">
                        Department
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 focus:border-1 hover:bg-primary-foreground"
                          type="text"
                          placeholder="Your department"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="sm:col-span-2">
                  <VisibilityDropdown value={Visibility.PUBLIC} />
                </FormItem>
              </div>

              <div className="flex flex-col items-start w-full gap-4 sm:grid sm:grid-cols-5 sm:items-end">
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem className="w-full sm:col-span-3">
                      <FormLabel className="font-medium text-muted-foreground">
                        Organization
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 focus:border-1 hover:bg-primary-foreground"
                          type="text"
                          placeholder="Your organization"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="sm:col-span-2">
                  <VisibilityDropdown value={Visibility.PUBLIC} />
                </FormItem>
              </div>

              <div className="flex flex-col items-start w-full gap-4 sm:grid sm:grid-cols-5 sm:items-end">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full sm:col-span-3">
                      <FormLabel className="font-medium text-muted-foreground">
                        Based in
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 focus:border-1 hover:bg-primary-foreground"
                          type="text"
                          placeholder="Your location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationVisibility"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormControl>
                        <VisibilityDropdown
                          value={field.value as Visibility}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col items-start w-full gap-4 sm:grid sm:grid-cols-5 sm:items-end">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="w-full sm:col-span-3">
                      <FormLabel className="font-medium text-muted-foreground">
                        Bio
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="w-full border-0 focus:border-1 hover:bg-primary-foreground"
                          placeholder="Tell us about yourself"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="sm:col-span-2">
                  <VisibilityDropdown value={Visibility.PUBLIC} />
                </FormItem>
              </div>
            </CardContent>
          </Card>
          <h2 className="mt-3 text-lg font-semibold">Contact</h2>
          <Card className="w-full">
            <CardContent className="flex flex-col w-full gap-3 p-6">
              <div className="flex flex-col items-start w-full gap-4 sm:grid sm:grid-cols-5 sm:items-end">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full sm:col-span-3">
                      <FormLabel className="font-medium text-muted-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 focus:border-1 hover:bg-primary-foreground"
                          type="email"
                          placeholder="Your email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailVisibility"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormControl>
                        <VisibilityDropdown
                          value={field.value as Visibility}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between w-full mt-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Icons.trash className="w-4 h-4 mr-2" />
                  Delete account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[95vw] rounded-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and all data associated with it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Form>
    </Shell>
  )
}

export default ManageProfilePage
