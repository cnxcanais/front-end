import { z } from "zod"

export const createBankAccountSchema = z.object({
  bank_id: z.string({ required_error: "Obrigatório" }),
  account_number: z.string({ required_error: "Obrigatório" }),
  agency: z.string({ required_error: "Obrigatório" }),
  observation: z.string(),
})

export type CreateBankAccountFormSchema = z.infer<
  typeof createBankAccountSchema
>
