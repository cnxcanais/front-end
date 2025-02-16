import { z } from "zod"

export const editExpenseCategoryFormSchema = z.object({
  name: z.string().nonempty(),
})

export type EditExpenseCategoryFormSchema = z.infer<
  typeof editExpenseCategoryFormSchema
>
