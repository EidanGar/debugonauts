"use client"

import { ProfileData, profileSchema } from "@/prisma/zod/profile"
import { zodResolver } from "@hookform/resolvers/zod"
import { Visibility } from "@prisma/client"
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
import {
  Form,
  FormControl,
  FormDescription,
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
import { Icons } from "@/components/icons"

import { UserAccount } from "../api/users/[userId]/route"
import { UserAccountContextType } from "./layout"

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

interface ProfileFormProps {
  defaultValues?: ProfileData
  setUserAccount: UserAccountContextType["setUserAccount"]
}

const ProfileForm = ({ setUserAccount, defaultValues }: ProfileFormProps) => {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues,
  })

  const onSubmit: SubmitHandler<ProfileData> = async (profileData) => {
    setUserAccount(profileData as UserAccount)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="flex flex-col items-start w-full gap-4">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Profile image</FormLabel>
                <FormControl>
                  <Input
                    className="hover:bg-primary-foreground"
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

          <FormItem>
            <VisibilityDropdown value={Visibility.PUBLIC} />
          </FormItem>
        </div>

        <div className="flex flex-col items-start w-full gap-4">
          <FormField
            control={form.control}
            name="bannerImage"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Header image</FormLabel>
                <FormControl>
                  <Input
                    className="hover:bg-primary-foreground"
                    type="url"
                    placeholder="https://example.com/image.png"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <VisibilityDropdown value={Visibility.PUBLIC} />
          </FormItem>
        </div>
        <div className="flex flex-col items-start w-full gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Username</FormLabel>
                <FormControl>
                  <Input
                    className="hover:bg-primary-foreground"
                    type="text"
                    placeholder="Your username"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym. You can only change this once every 30 days.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <VisibilityDropdown value={Visibility.PUBLIC} />
          </FormItem>
        </div>
        <div className="flex flex-col items-start w-full gap-4">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Job Title</FormLabel>
                <FormControl>
                  <Input
                    className="hover:bg-primary-foreground"
                    type="text"
                    placeholder="Your job title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <VisibilityDropdown value={Visibility.PUBLIC} />
          </FormItem>
        </div>
        <div className="flex flex-col items-start w-full gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Department</FormLabel>
                <FormControl>
                  <Input
                    className="hover:bg-primary-foreground"
                    type="text"
                    placeholder="Your department"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <VisibilityDropdown value={Visibility.PUBLIC} />
          </FormItem>
        </div>

        <div className="flex flex-col items-start w-full gap-4">
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Organization</FormLabel>
                <FormControl>
                  <Input
                    className="hover:bg-primary-foreground"
                    type="text"
                    placeholder="Your organization"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <VisibilityDropdown value={Visibility.PUBLIC} />
          </FormItem>
        </div>

        <div className="flex flex-col items-start w-full gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Based in</FormLabel>
                <FormControl>
                  <Input
                    className="hover:bg-primary-foreground"
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
              <FormItem>
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

        <div className="flex flex-col items-start w-full gap-4">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full hover:bg-primary-foreground"
                    placeholder="Tell us about yourself"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <VisibilityDropdown value={Visibility.PUBLIC} />
          </FormItem>
        </div>
        <div className="flex flex-col items-start w-full gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    className="hover:bg-primary-foreground"
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
              <FormItem>
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
  )
}

export default ProfileForm
