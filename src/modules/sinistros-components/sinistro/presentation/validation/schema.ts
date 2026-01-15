import { z } from "zod"

export const createSinistroSchema = z.object({
  numeroSinistro: z.string().min(1, "Número do sinistro é obrigatório"),
  apoliceId: z.string().min(1, "Apólice é obrigatória"),
  tipoSinistroId: z.string().min(1, "Tipo de sinistro é obrigatório"),
  emailSegurado: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório"),
  dataHoraOcorrido: z.string().min(1, "Data/hora do ocorrido é obrigatória"),
  descricaoOcorrido: z.string().min(1, "Descrição é obrigatória"),
  prestadora: z.string().optional(),
  andamento: z.string().optional(),
  dataUltimaTratativa: z
    .string()
    .min(1, "Data/hora da última tratativa é obrigatória"),
  responsavelUsuarioId: z.string().min(1, "Responsável é obrigatório"),
})

export type CreateSinistroSchema = z.infer<typeof createSinistroSchema>
