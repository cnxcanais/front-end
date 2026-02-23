import { z } from "zod"

export const editContaContabilFormSchema = z.object({
  id: z.string(),
  codigo: z.string().nonempty({ message: "Código é obrigatório" }),
  descricao: z.string().nonempty({ message: "Descrição é obrigatória" }),
})

export type EditContaContabilSchema = z.infer<typeof editContaContabilFormSchema>
