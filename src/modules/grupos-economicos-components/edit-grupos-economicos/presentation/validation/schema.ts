import { z } from "zod"

export const editGrupoEconomicoFormSchema = z.object({
  id: z.string(),
  nome: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 100 caracteres" }),
})

export type EditGrupoEconomicoSchema = z.infer<
  typeof editGrupoEconomicoFormSchema
>
