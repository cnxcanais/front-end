import { z } from "zod"

export const createGrupoEconomicoFormSchema = z.object({
  nome: z.string().nonempty({ message: "Obrigatório" }).max(255),
})

export type CreateGrupoEconomicoSchema = z.infer<typeof createGrupoEconomicoFormSchema>
