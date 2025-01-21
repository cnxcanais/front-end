import { z } from "zod"

export const editOrganizationFormSchema = z.object({
  name: z.string().nonempty({ message: "Campo não pode estar vazio" }),
  cnpj: z
    .string()
    .min(14, { message: "CNPJ precisa ter 14 caracteres" })
    .max(14, { message: "CNPJ precisa ter no máximo 14 caracteres" })
    .nonempty({ message: "Campo não pode estar vazio" }),
  address: z.string().nonempty({ message: "Campo não pode estar vazio" }),
  phone: z.string().nonempty({ message: "Campo não pode estar vazio" }),
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .nonempty({ message: "Campo não pode estar vazio" }),
  accountId: z.string().optional(),
})

export type EditOrganizationSchema = z.infer<typeof editOrganizationFormSchema>
