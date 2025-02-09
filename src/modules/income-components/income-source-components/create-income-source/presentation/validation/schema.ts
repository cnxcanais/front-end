import { z } from "zod"

export const createIncomeSourceFormSchema = z.object({
  name: z.string().nonempty({ message: "Obrigatório" }),
  cpf_cnpj: z
    .string()
    .min(11, { message: "Documento precisa ter no minimo 11 caracteres" })
    .max(14, { message: "Documento pode ter no máximo 14 caracteres" })
    .nonempty({ message: "Obrigatório" }),
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

export type CreateIncomeSourceSchema = z.infer<
  typeof createIncomeSourceFormSchema
>
