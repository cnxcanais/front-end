import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const createSeguradoraFormSchema = z.object({
  razaoSocial: z.string().nonempty({ message: "Obrigatório" }),
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
  codigoSusep: z.string().nonempty({ message: "Obrigatório" }),
  cep: z.string().nonempty({ message: "Obrigatório" }),
  endereco: z.string().nonempty({ message: "Obrigatório" }),
  numero: z.string().nonempty({ message: "Obrigatório" }),
  bairro: z.string().nonempty({ message: "Obrigatório" }),
  cidade: z.string().nonempty({ message: "Obrigatório" }),
  uf: z.string().nonempty({ message: "Obrigatório" }),
})

export type CreateSeguradoraSchema = z.infer<typeof createSeguradoraFormSchema>
