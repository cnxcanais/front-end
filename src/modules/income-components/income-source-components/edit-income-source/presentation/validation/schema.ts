import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const editIncomeSourceFormSchema = z.object({
  name: z.string(),
  cpf_cnpj: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .refine(
      (value) => {
        const cleanValue = value.replace(/\D/g, "")
        if (cleanValue.length === 11) {
          return validateCPF(cleanValue)
        }

        if (cleanValue.length === 14) {
          return validateCNPJ(cleanValue)
        }

        return false
      },
      { message: "CPF/CNPJ inválido" }
    ),
  city: z.string(),
  state: z.string(),
  cep: z.string(),
  address_1: z.string(),
  address_2: z.string(),
  address_3: z.string(),
  phone: z.string(),
  contact_name: z.string(),
  email: z.string().email({ message: "E-mail inválido" }),
  account_id: z.string().optional(),
})

export type EditIncomeSourceSchema = z.infer<typeof editIncomeSourceFormSchema>
