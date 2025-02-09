import { z } from "zod"

export const editExpenseDetailsSchema = z.object({
  amount: z.number().min(1, "Valor é obrigatório"),
  bank_account_id: z.string().nonempty("Conta bancária é obrigatória"),
  due_date: z.union(
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
  expense_id: z.string().nonempty("ID é obrigatório"),
  observation: z.string().optional(),
  part: z.coerce.number().min(1, "Parte é obrigatória"),
  expense_details_id: z.string().nonempty("ID é obrigatório"),
  is_paid: z.boolean().default(false),
})

export type EditExpenseSchema = z.infer<typeof editExpenseDetailsSchema>
