import { z } from "zod"

export const editFormSchema = z.object({
  account_id: z.string(),
  name: z.string().nonempty(),
  enabled: z.boolean().optional(),
})

export type EditFormSchema = z.infer<typeof editFormSchema>
