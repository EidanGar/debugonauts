"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"

import { defaultProjectTagOptions } from "@/lib/data"
import { validateSchema } from "@/lib/utils"
import {
  NewProjectData,
  Visibility,
  newProjectSchema,
} from "@/lib/validations/project"
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
import MultiSelect from "@/components/ui/multi-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const CreateProjectForm = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const form = useForm<NewProjectData>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      repository: "",
      tags: [],
      visibility: Visibility.PRIVATE,
    },
  })

  const onSubmit: SubmitHandler<NewProjectData> = async (data) => {
    data = { ...data, tags: selectedTags }
    const schemaValidationResult = await validateSchema<NewProjectData>(
      newProjectSchema,
      data
    )
    if (
      "issies" in schemaValidationResult ||
      "message" in schemaValidationResult
    ) {
      throw new Error("Invalid data")
    }

    console.log("Data is valid:", data)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="My awesome project"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="My awesome project description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="repository"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="https://www.github.com/username/repo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="visibility"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={Visibility.PUBLIC}>Public</SelectItem>
                      <SelectItem value={Visibility.PRIVATE}>
                        Private
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="tags"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  options={defaultProjectTagOptions}
                  setSelectedTags={setSelectedTags}
                  selectedTags={selectedTags}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Project</Button>
      </form>
    </Form>
  )
}

export default CreateProjectForm
