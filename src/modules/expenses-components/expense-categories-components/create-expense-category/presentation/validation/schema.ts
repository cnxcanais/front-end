import { z } from "zod"

export const createExpenseCategorieSchema = z.object({
  name: z.string(),
  account_id: z.string(),
})

export type CreateExpensecategorieschema = z.infer<
  typeof createExpenseCategorieSchema
>
