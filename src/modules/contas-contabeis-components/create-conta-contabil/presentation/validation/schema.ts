import { z } from "zod"

export const createContaContabilFormSchema = z.object({
  corretoraId: z.string().nonempty({ message: "Corretora é obrigatória" }),
  codigo: z.string().nonempty({ message: "Código é obrigatório" }),
  descricao: z.string().nonempty({ message: "Descrição é obrigatória" }),
})

export type CreateContaContabilSchema = z.infer<typeof createContaContabilFormSchema>
