import { z } from "zod"

export const editBankAccountSchema = z.object({
  bank_id: z.string(),
  account_number: z.string(),
  agency: z.string(),
  observation: z.string(),
})

export type EditBankAccountFormSchema = z.infer<typeof editBankAccountSchema>
