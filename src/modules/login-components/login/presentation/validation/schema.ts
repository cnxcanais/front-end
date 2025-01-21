import { z } from "zod"

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .nonempty({ message: "Campo não pode estar vazio" }),
  password: z
    .string()
    .min(8, { message: "Senha precisa ter no mínimo 8 caracteres." })
    .nonempty({ message: "Campo não pode estar vazio" }),
})

export type LoginSchema = z.infer<typeof loginFormSchema>
