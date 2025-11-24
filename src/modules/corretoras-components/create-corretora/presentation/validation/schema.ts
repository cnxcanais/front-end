import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const createCorretoraFormSchema = z.object({
  razaoSocial: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 255 caracteres" }),
  nomeFantasia: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 255 caracteres" }),
  cnpjCpfFormatado: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(18, { message: "Campo deve ter no máximo 18 caracteres" })
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
  codigoSusep: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(20, { message: "Campo deve ter no máximo 20 caracteres" }),
  grupoEconomicoId: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  gerente: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  contato: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  celular: z
    .string()
    .max(20, { message: "Campo deve ter no máximo 20 caracteres" })
    .optional(),
  cepFormatado: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(9, { message: "Campo deve ter no máximo 9 caracteres" }),
  endereco: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(255, { message: "Campo deve ter no máximo 255 caracteres" }),
  numero: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(10, { message: "Campo deve ter no máximo 10 caracteres" }),
  complemento: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  bairro: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" }),
  cidade: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" }),
  uf: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(2, { message: "Campo deve ter no máximo 2 caracteres" }),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .max(255, { message: "Campo deve ter no máximo 255 caracteres" }),
  telefone: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(20, { message: "Campo deve ter no máximo 20 caracteres" }),
  telefoneSecundario: z
    .string()
    .max(20, { message: "Campo deve ter no máximo 20 caracteres" })
    .optional(),
  website: z
    .string()
    .url({ message: "Url inválida" })
    .max(255, { message: "Campo deve ter no máximo 255 caracteres" })
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

export type CreateCorretoraSchema = z.infer<typeof createCorretoraFormSchema>
