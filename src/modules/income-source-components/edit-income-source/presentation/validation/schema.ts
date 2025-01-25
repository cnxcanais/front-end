import { z } from "zod"

export const editIncomeSourceFormSchema = z.object({
  name: z.string(),
  cpf_cnpj: z
    .string()
    .min(11, { message: "Documento precisa ter no minimo 11 caracteres" })
    .max(14, { message: "Documento pode ter no máximo 14 caracteres" }),
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
