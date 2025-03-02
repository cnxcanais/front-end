import { z } from "zod"

const expenseDetailsSchema = z.object({
  amount: z.coerce.number().gt(0, "Valor deve ser maior que zero"),
  bank_account_id: z
    .string({ required_error: "Conta bancária é obrigatória" })
    .nonempty(),
  part: z.coerce.number().gt(0, "Parcela deve ser maior que zero"),
  due_date: z.union(
    [
      z
        .string({ message: "Data de vencimento é obrigatória" })
        .nonempty()
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
  expense_id: z.string().optional(),
  account_id: z.string().nonempty("Account ID é obrigatório"),
  observation: z.string().optional(),
})

export const createExpenseFormSchema = z.object({
  account_id: z.string().nonempty("Account ID é obrigatório"),
  date: z.union([
    z
      .string()
      .nonempty("Data de vencimento é obrigatória")
      .transform((str) => new Date(str)),
    z.date({
      required_error: "Data de vencimento é obrigatória",
      invalid_type_error: "Data inválida",
    }),
  ]),
  description: z.string().nonempty("Descrição é obrigatória"),
  document: z.string().nonempty("Documento é obrigatório"),
  expense_group_id: z.string().nonempty("Grupo é obrigatório"),
  expense_percentage: z.coerce.number().min(1, "Porcentagem é obrigatória"),
  supplier_id: z.string().nonempty("Fornecedor é obrigatório"),
  organization_id: z.string().nonempty("Organização é obrigatória"),
  is_operational: z.coerce.boolean(),
  is_variable: z.coerce.boolean(),
  expenseDetailsArray: z.array(expenseDetailsSchema),
  destinyFranchiseBankId: z.string().optional().nullable(),
  destinyFranchiseId: z.string().optional().nullable(),
  destinyFranchiseOrganizationId: z.string().optional().nullable(),
})

export type ExpenseSchema = z.infer<typeof createExpenseFormSchema>
