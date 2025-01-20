import { z } from "zod"

export const loginFormSchema = z.object({
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .email({ message: "E-mail inválido" })
    .nonempty(),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(8, { message: "Senha precisa ter no mínimo 8 caracteres." })
    .nonempty(),
})

export type LoginSchema = z.infer<typeof loginFormSchema>
