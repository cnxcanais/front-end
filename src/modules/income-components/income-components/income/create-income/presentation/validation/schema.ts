import { z } from "zod"

const incomeDetailsSchema = z.object({
  amount: z.number().gt(0, "Valor deve ser maior que zero"),
  bank_account_id: z.string().nonempty("Conta bancária é obrigatória"),
  part: z.number().gt(0, "Parcela deve ser maior que zero"),
  due_date: z.union(
    [
      z
        .string()
        .nonempty("Data de vencimento é obrigatória")
        .transform((str) => {
          const date = new Date(str)
          if (isNaN(date.getTime())) {
            throw new Error("Data inválida")
          }
          return date
        }),
      z.date({
        required_error: "Data de vencimento é obrigatória",
        invalid_type_error: "Data inválida",
      }),
    ],
    {
      required_error: "Data de vencimento é obrigatória",
    }
  ),
  income_id: z.string().optional(),
  account_id: z.string().nonempty("Account ID é obrigatório"),
  observation: z.string().optional(),
})

export const createIncomeFormSchema = z.object({
  account_id: z.string().nonempty("Account ID é obrigatório"),
  date: z.union(
    [
      z
        .string()
        .nonempty("Data de vencimento é obrigatória")
        .transform((str) => {
          const date = new Date(str)
          if (isNaN(date.getTime())) {
            throw new Error("Data inválida")
          }
          return date
        }),
      z.date({
        required_error: "Data de vencimento é obrigatória",
        invalid_type_error: "Data inválida",
      }),
    ],
    {
      required_error: "Data de vencimento é obrigatória",
    }
  ),
  description: z.string().nonempty("Descrição é obrigatória"),
  document: z.string().nonempty("Documento é obrigatório"),
  income_group_id: z.string().nonempty("Grupo é obrigatório"),
  income_percentage: z.number().min(1, "Porcentagem é obrigatória"),
  income_source_id: z.string().nonempty("Fonte de receita é obrigatória"),
  organization_id: z.string().nonempty("Organização é obrigatória"),
  incomeDetailsArray: z.array(incomeDetailsSchema),
})

export type CreateIncomeSchema = z.infer<typeof createIncomeFormSchema>
