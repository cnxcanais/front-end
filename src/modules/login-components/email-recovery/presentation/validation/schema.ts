import { z } from "zod"

export const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .email({ message: "E-mail inválido" })
    .nonempty(),
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
