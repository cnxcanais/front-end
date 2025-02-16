import { z } from "zod"

export const createExpenseGroupSchema = z.object({
  group_name: z.string({ required_error: "Campo Obrigatório" }),
  account_id: z.string(),
  expense_category_id: z.string({ required_error: "Campo Obrigatório" }),
})

export type CreateExpenseGroupSchema = z.infer<typeof createExpenseGroupSchema>
