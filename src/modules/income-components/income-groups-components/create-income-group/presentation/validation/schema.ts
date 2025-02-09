import { z } from "zod"

export const createIncomeGroupSchema = z.object({
  group_name: z.string(),
  account_id: z.string(),
})

export type CreateIncomeGroupSchema = z.infer<typeof createIncomeGroupSchema>
