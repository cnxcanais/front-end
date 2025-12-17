import { z } from "zod"

export const editUsuarioFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  perfilId: z.string().min(1, "Perfil é obrigatório"),
  corretoraId: z.string().optional().nullable(),
})

export type EditUsuarioSchema = z.infer<typeof editUsuarioFormSchema>
