import { z } from "zod"

export const createIncomeFormSchema = z.object({
  account_id: z.string().nonempty("Account ID é obrigatório"),
  amount: z.number().min(1, "Valor é obrigatório"),
  date: z.date({
    required_error: "Data é obrigatória",
  }),
  description: z.string().nonempty("Descrição é obrigatória"),
  document: z.string().nonempty("Documento é obrigatório"),
  income_group_id: z.string().nonempty("Grupo é obrigatório"),
  income_percentage: z.string().nonempty("Porcentagem é obrigatória"),
  income_source_id: z.string().nonempty("Fonte de receita é obrigatória"),
  organization_id: z.string().nonempty("Organização é obrigatória"),
})

export type CreateIncomeSchema = z.infer<typeof createIncomeFormSchema>
