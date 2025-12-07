import { z } from "zod"

export const createRamoFormSchema = z.object({
  descricao: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 255 caracteres" }),
})

export type CreateRamoSchema = z.infer<typeof createRamoFormSchema>
