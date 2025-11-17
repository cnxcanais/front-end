import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const editSeguradoraFormSchema = z.object({
  id: z.string().nonempty({ message: "Obrigatório" }),
  razaoSocial: z.string().nonempty({ message: "Obrigatório" }).max(200),
  cnpjFormatado: z
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
  codigoSusep: z.string().nonempty({ message: "Obrigatório" }).max(50),
  fantasia: z.string().max(100).optional(),
  grupo: z.string().max(100).optional(),
  impostoRetido: z
    .string()
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(0).max(100).optional()),
  habilitarJuros: z.boolean().optional(),
  calculoDesconto: z.string().max(100).optional(),
  calculoDescontoPadrao: z.boolean().optional(),
  diretor: z.string().max(100).optional(),
  gerente: z.string().max(100).optional(),
  website: z.string().max(255).optional(),
  email: z.string().email({ message: "Email inválido" }).max(100).optional(),
  telefone: z.string().max(20).optional(),
  telefoneSecundario: z.string().max(20).optional(),
  telefoneAssistencia24h: z.string().max(20).optional(),
  observacoes: z.string().optional(),
  cep: z.string().nonempty({ message: "Obrigatório" }).max(9),
  endereco: z.string().nonempty({ message: "Obrigatório" }).max(200),
  numero: z.string().nonempty({ message: "Obrigatório" }).max(10),
  bairro: z.string().nonempty({ message: "Obrigatório" }).max(100),
  cidade: z.string().nonempty({ message: "Obrigatório" }).max(100),
  uf: z.string().nonempty({ message: "Obrigatório" }).max(2),
})

export type EditSeguradoraSchema = z.infer<typeof editSeguradoraFormSchema>
