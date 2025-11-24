import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const createSeguradoraFormSchema = z.object({
  razaoSocial: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(200, { message: "Campo deve ter no máximo 200 caracteres" }),
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
  codigoSusep: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(50, { message: "Campo deve ter no máximo 50 caracteres" }),
  fantasia: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  grupoEconomicoId: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  impostoRetido: z
    .string()
    .transform((val) => val.replace(",", "."))
    .pipe(
      z.coerce
        .number()
        .min(0)
        .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
        .optional()
    ),
  habilitarJuros: z.boolean().optional(),
  calculoDesconto: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  calculoDescontoPadrao: z.boolean().optional(),
  diretor: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  gerente: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  website: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
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
    .optional(),

  telefone: z.string().optional(),
  telefoneSecundario: z.string().optional(),
  telefoneAssistencia24h: z.string().optional(),
  observacoes: z
    .string()
    .max(500, { message: "Campo deve ter no máximo 500 caracteres" })
    .optional(),
  cep: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(9, { message: "Campo deve ter no máximo 9 caracteres" }),
  endereco: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(200, { message: "Campo deve ter no máximo 200 caracteres" }),
  numero: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(10, { message: "Campo deve ter no máximo 10 caracteres" }),
  bairro: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" }),
  cidade: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" }),
  complemento: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .optional(),
  uf: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(2, { message: "Campo deve ter no máximo 2 caracteres" }),
})

export type CreateSeguradoraSchema = z.infer<typeof createSeguradoraFormSchema>
