import { z } from "zod"

export const createGrupoEconomicoFormSchema = z.object({
  nome: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 100 caracteres" }),
})

export type CreateGrupoEconomicoSchema = z.infer<
  typeof createGrupoEconomicoFormSchema
>
