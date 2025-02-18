import { z } from "zod"

export const editExpenseGroupFormSchema = z.object({
  group_name: z.string().nonempty({ message: "Nome não pode estar vazio." }),
  expense_category_id: z
    .string()
    .nonempty({ message: "Grupo não pode estar vazio." }),
})

export type EditExpenseGroupFormSchema = z.infer<
  typeof editExpenseGroupFormSchema
>
