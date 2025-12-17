import { z } from "zod"

export const createPerfilFormSchema = z.object({
  nome: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 100 caracteres" }),
  descricao: z
    .string()
    .max(500, { message: "Campo deve ter no máximo 500 caracteres" })
    .optional(),
  isSistema: z.boolean().default(false),
})

export type CreatePerfilSchema = z.infer<typeof createPerfilFormSchema>
