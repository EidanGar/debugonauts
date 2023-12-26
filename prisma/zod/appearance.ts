import { AppTheme } from "@prisma/client"
import { z } from "zod"

import { stringPreprocessor } from "./profile"

const themePreprocessor = (foo: any) => {
  if (!foo || typeof foo !== "string") return undefined
  if (
    foo === AppTheme.DARK ||
    foo === AppTheme.LIGHT ||
    foo === AppTheme.SYSTEM
  ) {
    return foo as AppTheme
  }
}

export const appearanceFormSchema = z.object({
  themePreference: z.preprocess(
    themePreprocessor,
    z
      .enum([AppTheme.DARK, AppTheme.LIGHT, AppTheme.SYSTEM], {
        required_error: "Please select a theme.",
      })
      .default(AppTheme.SYSTEM)
  ),
  fontPreference: z.preprocess(
    stringPreprocessor,
    z.string({
      invalid_type_error: "Select a font",
      required_error: "Please select a font.",
    })
  ),
})

export type AppearanceData = z.infer<typeof appearanceFormSchema>
