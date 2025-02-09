import { z } from "zod"

export const createBudgetIncomeFormSchema = z.object({
  data: z.array(
    z.object({
      description: z.string().nonempty({ message: "Obrigatório" }),
      amount: z.coerce
        .number()
        .min(0.01, { message: "Valor deve ser maior que zero" }),
      income_group_id: z.string().nonempty({ message: "Obrigatório" }),
      date: z.string().nonempty({ message: "Obrigatório" }),
      account_id: z.string(),
    })
  ),
  parts: z.coerce.number().default(1),
})

export type CreateBudgetIncomeSchema = z.infer<
  typeof createBudgetIncomeFormSchema
>
