import { z } from "zod"

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .nonempty({ message: "Obrigatório" }),
  password: z
    .string()
    .min(8, { message: "Senha precisa ter no mínimo 8 caracteres." })
    .max(128, { message: "Senha muito longa" })
    .nonempty({ message: "Obrigatório" }),
})

export type LoginSchema = z.infer<typeof loginFormSchema>
