import { z } from "zod"

export const editBudgetIncomeFormSchema = z.object({
  budget_income_id: z.string(),
  description: z.string().nonempty({ message: "Obrigatório" }),
  amount: z.coerce
    .number()
    .min(0.01, { message: "Valor deve ser maior que zero" }),
  income_group_id: z.string().nonempty({ message: "Obrigatório" }),
  date: z.string().nonempty({ message: "Obrigatório" }),
  account_id: z.string(),
})

export type EditBudgetIncomeSchema = z.infer<typeof editBudgetIncomeFormSchema>
