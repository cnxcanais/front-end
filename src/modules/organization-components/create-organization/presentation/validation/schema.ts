import { z } from "zod"

export const createOrganizationFormSchema = z.object({
  name: z.string().nonempty({ message: "Obrigatório" }),
  cnpj: z
    .string()
    .min(14, { message: "CNPJ precisa ter 14 caracteres" })
    .max(14, { message: "CNPJ precisa ter no máximo 14 caracteres" })
    .nonempty({ message: "Obrigatório" }),
  address: z.string().nonempty({ message: "Obrigatório" }),
  phone: z.string().nonempty({ message: "Obrigatório" }),
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .nonempty({ message: "Obrigatório" }),
  accountId: z.string(),
})

export type CreateOrganizationSchema = z.infer<
  typeof createOrganizationFormSchema
>
