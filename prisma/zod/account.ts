import { z } from "zod"

import { stringPreprocessor } from "./profile"

export const accountFormSchema = z.object({
  fullName: z.preprocess(
    stringPreprocessor,
    z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(30, {
        message: "Name must not be longer than 30 characters.",
      })
      .optional()
  ),
  dob: z
    .date({
      invalid_type_error: "Date of birth must be a date.",
    })
    .optional(),
  language: z.preprocess(
    stringPreprocessor,
    z
      .string({
        required_error: "Please select a language.",
      })
      .optional()
  ),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>
