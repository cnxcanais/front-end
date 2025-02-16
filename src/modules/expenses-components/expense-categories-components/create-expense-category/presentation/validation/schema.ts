import { z } from "zod"

export const createExpensecategorieschema = z.object({
  name: z.string(),
  account_id: z.string(),
})

export type CreateExpensecategorieschema = z.infer<
  typeof createExpensecategorieschema
>
