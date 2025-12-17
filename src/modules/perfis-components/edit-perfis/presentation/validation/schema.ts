import { z } from "zod"

export const editPerfilFormSchema = z.object({
  nome: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 100 caracteres" }),
  descricao: z
    .string()
    .max(500, { message: "Campo deve ter no máximo 500 caracteres" })
    .optional(),
})

export type EditPerfilSchema = z.infer<typeof editPerfilFormSchema>
