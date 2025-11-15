import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const editCorretoraFormSchema = z.object({
  id: z.string(),
  razaoSocial: z.string().nonempty({ message: "Obrigatório" }).max(255),
  nomeFantasia: z.string().nonempty({ message: "Obrigatório" }).max(255),
  cnpjCpfFormatado: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(18)
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
  codigoSusep: z.string().nonempty({ message: "Obrigatório" }).max(20),
  cepFormatado: z.string().nonempty({ message: "Obrigatório" }).max(9),
  endereco: z.string().nonempty({ message: "Obrigatório" }).max(255),
  numero: z.string().nonempty({ message: "Obrigatório" }).max(10),
  complemento: z.string().max(100).optional(),
  bairro: z.string().nonempty({ message: "Obrigatório" }).max(100),
  cidade: z.string().nonempty({ message: "Obrigatório" }).max(100),
  uf: z.string().nonempty({ message: "Obrigatório" }).max(2),
  email: z.string().email({ message: "Email inválido" }).max(255),
  telefone: z.string().nonempty({ message: "Obrigatório" }).max(20),
  telefoneSecundario: z.string().max(20).optional(),
  website: z
    .string()
    .url({ message: "Url inválida" })
    .refine(
      (val) => {
        if (val === "") return true
        try {
          const url = new URL(val)
          return /\.[a-z]{2,}$/i.test(url.hostname)
        } catch {
          return false
        }
      },
      { message: "Url inválida" }
    )
    .or(z.literal("")),
  percentualImposto: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(0).max(100)),
  observacoes: z.string().optional(),
  consentimentoLgpd: z.boolean(),
})

export type EditCorretoraSchema = z.infer<typeof editCorretoraFormSchema>
