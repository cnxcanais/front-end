import { z } from "zod"

export const createTipoSinistroFormSchema = z.object({
  descricao: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 255 caracteres" }),
  ramoId: z.string().nonempty({ message: "Ramo é obrigatório" }),
})

export type CreateTipoSinistroSchema = z.infer<typeof createTipoSinistroFormSchema>
