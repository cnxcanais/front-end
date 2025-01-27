import { z } from "zod"

export const editBankSchema = z.object({
  name: z.string({ required_error: "Obrigatorio" }),
  bank_number: z.coerce.number({ required_error: "Obrigatorio" }),
  account_id: z.string(),
})

export type EditBankFormSchema = z.infer<typeof editBankSchema>
