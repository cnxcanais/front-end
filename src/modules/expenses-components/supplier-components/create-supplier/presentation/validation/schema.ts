import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const createSupplierFormSchema = z.object({
  name: z.string().nonempty({ message: "Obrigatório" }),
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
  city: z.string().nonempty({ message: "Obrigatório" }),
  state: z.string().nonempty({ message: "Obrigatório" }),
  cep: z.string().nonempty({ message: "Obrigatório" }),
  address_1: z.string().nonempty({ message: "Obrigatório" }),
  address_2: z.string().default(null),
  address_3: z.string().default(null),
  phone: z.string().nonempty({ message: "Obrigatório" }),
  contact_name: z.string().nonempty({ message: "Obrigatório" }),
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .nonempty({ message: "Obrigatório" }),
  account_id: z.string().optional(),
})

export type CreateSupplierSchema = z.infer<typeof createSupplierFormSchema>
