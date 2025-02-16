import { z } from "zod"

export const createIncomeCategorieschema = z.object({
  name: z.string(),
  account_id: z.string(),
})

export type CreateIncomecategorieschema = z.infer<
  typeof createIncomeCategorieschema
>
