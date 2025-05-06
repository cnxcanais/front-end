import { z } from "zod"

export const editExpenseSchema = z.object({
  expense_id: z.string().nonempty("ID é obrigatório"),
  date: z.union(
    [
      z
        .string({ message: "Data é obrigatória" })
        .nonempty()
        .transform((str) => {
          const date = new Date(str)
          if (isNaN(date.getTime())) {
            throw new Error("Data inválida")
          }
          return date
        }),
      z.date({
        required_error: "Data é obrigatória",
        invalid_type_error: "Data inválida",
      }),
    ],
    {
      required_error: "Data é obrigatória",
    }
  ),
  description: z.string().nonempty("Descrição é obrigatória"),
  document: z.string().nonempty("Documento é obrigatório"),
  expense_group_id: z.string().nonempty("Grupo é obrigatório"),
  expense_percentage: z.coerce.number().min(0, "Porcentagem é obrigatória"),
  supplier_id: z.string().nonempty("Fornecedor é obrigatório"),
  organization_id: z.string().nonempty("Organização é obrigatória"),
  is_operational: z.boolean({ required_error: "Obrigatório!" }),
  is_variable: z.boolean({ required_error: "Obrigatório!" }),
  account_id: z.string().nonempty("ID da conta é obrigatório"),
})

export type EditExpenseSchema = z.infer<typeof editExpenseSchema>
