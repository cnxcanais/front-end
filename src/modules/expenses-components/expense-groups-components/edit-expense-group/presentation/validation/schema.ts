import { z } from "zod"

export const editExpenseGroupFormSchema = z.object({
  group_name: z.string().nonempty(),
})

export type EditExpenseGroupFormSchema = z.infer<
  typeof editExpenseGroupFormSchema
>
