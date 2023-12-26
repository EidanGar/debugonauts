import { NotificationSettings } from "@prisma/client"
import { z } from "zod"

export const notificationsFormSchema = z.object({
  notifications: z
    .enum([
      NotificationSettings.NONE,
      NotificationSettings.ALL,
      NotificationSettings.MENTIONS_ONLY,
    ])
    .default(NotificationSettings.ALL)
    .optional(),
  mobileNotifsDiff: z.boolean().default(false).optional(),
  commNotifs: z.boolean().default(false).optional(),
  socialNotifs: z.boolean().default(false).optional(),
  marketingNotifs: z.boolean().default(false).optional(),
  securityNotifs: z.boolean().default(false).optional(),
})

export type NotificationsData = z.infer<typeof notificationsFormSchema>
