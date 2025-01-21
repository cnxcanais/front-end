import { z } from "zod"

export const createAccountSchema = z.object({
  name: z.string(),
})

export type CreateAccountSchema = z.infer<typeof createAccountSchema>
