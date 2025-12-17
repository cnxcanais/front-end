import { z } from "zod"

export const createUsuarioFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  perfilId: z.string().min(1, "Perfil é obrigatório"),
  corretoraId: z.string().optional().nullable(),
  isMaster: z.boolean(),
})

export type CreateUsuarioSchema = z.infer<typeof createUsuarioFormSchema>
