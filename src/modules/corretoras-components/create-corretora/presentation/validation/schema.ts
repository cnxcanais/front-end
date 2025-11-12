import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const createCorretoraFormSchema = z.object({
  razaoSocial: z.string().nonempty({ message: "Obrigatório" }),
  nomeFantasia: z.string().nonempty({ message: "Obrigatório" }),
  cnpjCpfFormatado: z
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
  cepFormatado: z.string().nonempty({ message: "Obrigatório" }),
  endereco: z.string().nonempty({ message: "Obrigatório" }),
  numero: z.string().nonempty({ message: "Obrigatório" }),
  complemento: z.string().optional(),
  bairro: z.string().nonempty({ message: "Obrigatório" }),
  cidade: z.string().nonempty({ message: "Obrigatório" }),
  uf: z.string().nonempty({ message: "Obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().nonempty({ message: "Obrigatório" }),
  telefoneSecundario: z.string().optional(),
  website: z
    .string()
    .url({ message: "Url inválida" })
    .optional()
    .or(z.literal("")),
  percentualComissao: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .pipe(z.coerce.number().min(0).max(100)),
  observacoes: z.string().optional(),
  consentimentoLgpd: z.boolean(),
})

export type CreateCorretoraSchema = z.infer<typeof createCorretoraFormSchema>
