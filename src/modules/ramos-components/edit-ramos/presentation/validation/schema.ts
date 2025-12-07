import { z } from "zod"

export const editRamoFormSchema = z.object({
  id: z.string(),
  descricao: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 255 caracteres" }),
})

export type EditRamoSchema = z.infer<typeof editRamoFormSchema>
