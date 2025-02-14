import { validateCNPJ } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const editOrganizationFormSchema = z.object({
  name: z.string().nonempty({ message: "Campo não pode estar vazio" }),
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
  address: z.string().nonempty({ message: "Campo não pode estar vazio" }),
  phone: z.string().nonempty({ message: "Campo não pode estar vazio" }),
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .nonempty({ message: "Campo não pode estar vazio" }),
  account_id: z.string().optional(),
})

export type EditOrganizationSchema = z.infer<typeof editOrganizationFormSchema>
