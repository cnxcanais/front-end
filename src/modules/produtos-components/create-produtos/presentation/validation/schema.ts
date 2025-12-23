import { z } from "zod"

export const createProdutoFormSchema = z.object({
  ramoId: z.string().nonempty({ message: "Ramo é obrigatório" }),
  descricao: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 255 caracteres" }),
  seguroRenovavel: z.boolean().default(false),
})

export type CreateProdutoSchema = z.infer<typeof createProdutoFormSchema>
