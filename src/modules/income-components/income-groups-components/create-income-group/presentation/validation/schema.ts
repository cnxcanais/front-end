import { z } from "zod"

export const createIncomeGroupSchema = z.object({
  group_name: z.string({ required_error: "Campo Obrigatório" }),
  account_id: z.string(),
  income_category_id: z.string({ required_error: "Campo Obrigatório" }),
})

export type CreateIncomeGroupSchema = z.infer<typeof createIncomeGroupSchema>
