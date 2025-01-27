import { z } from "zod"

export const createExpenseGroupSchema = z.object({
  group_name: z.string(),
  account_id: z.string(),
})

export type CreateExpenseGroupSchema = z.infer<typeof createExpenseGroupSchema>
