import { z } from "zod"

export const editIncomeCategoryFormSchema = z.object({
  name: z.string().nonempty(),
})

export type EditIncomeCategoryFormSchema = z.infer<
  typeof editIncomeCategoryFormSchema
>
