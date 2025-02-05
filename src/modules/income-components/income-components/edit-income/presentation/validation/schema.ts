import { z } from "zod"

export const editIncomeSchema = z.object({
  income_id: z.string().nonempty("ID é obrigatório"),
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
  income_group_id: z.string().nonempty("Grupo é obrigatório"),
  income_percentage: z.coerce.number().min(1, "Porcentagem é obrigatória"),
  income_source_id: z.string().nonempty("Fonte de receita é obrigatória"),
  organization_id: z.string().nonempty("Organização é obrigatória"),
})

export type EditIncomeSchema = z.infer<typeof editIncomeSchema>
