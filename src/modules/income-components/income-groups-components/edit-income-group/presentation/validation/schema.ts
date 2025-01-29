import { z } from "zod"

export const editIncomeGroupFormSchema = z.object({
  group_name: z.string().nonempty(),
})

export type EditIncomeGroupFormSchema = z.infer<
  typeof editIncomeGroupFormSchema
>
