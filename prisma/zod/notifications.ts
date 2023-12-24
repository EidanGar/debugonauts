import { NotificationSettings } from "@prisma/client"
import { z } from "zod"

export const notificationsFormSchema = z.object({
  type: z
    .enum([
      NotificationSettings.NONE,
      NotificationSettings.ALL,
      NotificationSettings.MENTIONS_ONLY,
    ])
    .default(NotificationSettings.ALL)
    .optional(),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean().default(false).optional(),
})

export type NotificationsFormValues = z.infer<typeof notificationsFormSchema>
