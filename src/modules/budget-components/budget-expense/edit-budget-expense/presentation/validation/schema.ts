import { z } from "zod"

export const editBudgetExpenseFormSchema = z.object({
  budget_expense_id: z.string(),
  description: z.string().nonempty({ message: "Obrigatório" }),
  amount: z.coerce
    .number()
    .min(0.01, { message: "Valor deve ser maior que zero" }),
  expense_group_id: z.string().nonempty({ message: "Obrigatório" }),
  date: z.string().nonempty({ message: "Obrigatório" }),
  account_id: z.string(),
})

export type EditBudgetExpenseSchema = z.infer<
  typeof editBudgetExpenseFormSchema
>
