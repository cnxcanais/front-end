import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const createSeguradoraFormSchema = z.object({
  razaoSocial: z.string().nonempty({ message: "Obrigatório" }).max(200),
  cnpj: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .refine(
      (value) => {
        const cleanValue = value.replace(/\D/g, "")
        if (cleanValue.length === 11) {
          return validateCPF(cleanValue)
        }

        if (cleanValue.length === 14) {
          return validateCNPJ(cleanValue)
        }

        return false
      },
      { message: "CPF/CNPJ inválido" }
    ),
  codigoSusep: z.string().nonempty({ message: "Obrigatório" }).max(50),
  cep: z.string().nonempty({ message: "Obrigatório" }).max(9),
  endereco: z.string().nonempty({ message: "Obrigatório" }).max(200),
  numero: z.string().nonempty({ message: "Obrigatório" }).max(10),
  bairro: z.string().nonempty({ message: "Obrigatório" }).max(100),
  cidade: z.string().nonempty({ message: "Obrigatório" }).max(100),
  uf: z.string().nonempty({ message: "Obrigatório" }).max(2),
})

export type CreateSeguradoraSchema = z.infer<typeof createSeguradoraFormSchema>
