import { z } from "zod"

export const editProdutoFormSchema = z.object({
  id: z.string(),
  descricao: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 255 caracteres" }),
})

export type EditProdutoSchema = z.infer<typeof editProdutoFormSchema>
