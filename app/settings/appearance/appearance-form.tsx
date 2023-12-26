"use client"

import { AppearanceData, appearanceFormSchema } from "@/prisma/zod/appearance"
import { zodResolver } from "@hookform/resolvers/zod"
import { AppTheme } from "@prisma/client"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { SubmitHandler, useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserAccount } from "@/app/api/users/[userId]/route"

import { UserAccountContextType } from "../layout"

interface AppearanceFormProps {
  defaultValues?: AppearanceData
  setUserAccount: UserAccountContextType["setUserAccount"]
}

export const AppearanceForm = ({
  defaultValues,
  setUserAccount,
}: AppearanceFormProps) => {
  const form = useForm<AppearanceData>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  const onSubmit: SubmitHandler<AppearanceData> = async (appearanceData) => {
    setUserAccount({ account: appearanceData } as UserAccount)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fontPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <div className="relative w-max">
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-[200px] appearance-none bg-transparent font-normal"
                    )}
                    {...field}
                  >
                    <option value="inter">Inter</option>
                    <option value="manrope">Manrope</option>
                    <option value="system">System</option>
                  </select>
                </FormControl>
                <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
              </div>
              <FormDescription>
                Set the font you want to use in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="themePreference"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem
                        value={AppTheme.LIGHT}
                        className="sr-only"
                      />
                    </FormControl>
                    <div className="items-center p-1 border-2 rounded-md border-muted hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="p-2 space-y-2 bg-white rounded-md shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center p-2 space-x-2 bg-white rounded-md shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center p-2 space-x-2 bg-white rounded-md shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 font-normal text-center">
                      Light
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem
                        value={AppTheme.DARK}
                        className="sr-only"
                      />
                    </FormControl>
                    <div className="items-center p-1 border-2 rounded-md border-muted bg-popover hover:bg-accent hover:text-accent-foreground">
                      <div className="p-2 space-y-2 rounded-sm bg-slate-950">
                        <div className="p-2 space-y-2 rounded-md shadow-sm bg-slate-800">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center p-2 space-x-2 rounded-md shadow-sm bg-slate-800">
                          <div className="w-4 h-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center p-2 space-x-2 rounded-md shadow-sm bg-slate-800">
                          <div className="w-4 h-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 font-normal text-center">
                      Dark
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type="submit">Update preferences</Button>
      </form>
    </Form>
  )
}
