import { z } from "zod"

export const editExpenseGroupFormSchema = z.object({
  group_name: z.string().nonempty({ message: "Nome não pode estar vazio." }),
  expense_category_id: z
    .string()
    .nonempty({ message: "Categoria não pode estar vazia." }),
})

export type EditExpenseGroupFormSchema = z.infer<
  typeof editExpenseGroupFormSchema
>
