import { validateCNPJ } from "@/core/utils/validadeDocuments"

import { z } from "zod"

export const createOrganizationFormSchema = z.object({
  name: z.string().nonempty({ message: "Obrigatório" }),
  cnpj: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .refine(
      (value) => {
        const cleanValue = value.replace(/\D/g, "")
        if (cleanValue.length === 14) {
          return validateCNPJ(cleanValue)
        }

        return false
      },
      { message: "CNPJ inválido" }
    ),
  address: z.string().nonempty({ message: "Obrigatório" }),
  phone: z.string().nonempty({ message: "Obrigatório" }),
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .nonempty({ message: "Obrigatório" }),
  account_id: z.string(),
})

export type CreateOrganizationSchema = z.infer<
  typeof createOrganizationFormSchema
>
