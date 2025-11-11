import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const createProdutorFormSchema = z.object({
  nome: z.string().nonempty({ message: "Obrigatório" }),
  situacao: z.string().nonempty({ message: "Obrigatório" }),
  pessoa: z.string().nonempty({ message: "Obrigatório" }),
  cnpjCpf: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .refine(
      (value) => {
        const cleanValue = value.replace(/\D/g, "")
        if (cleanValue.length === 11) return validateCPF(cleanValue)
        if (cleanValue.length === 14) return validateCNPJ(cleanValue)
        return false
      },
      { message: "CPF/CNPJ inválido" }
    ),
  corretoraId: z.string().nonempty({ message: "Obrigatório" }),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  telefoneFixo: z.string().optional(),
  telefoneCelular: z.string().nonempty({ message: "Obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  cep: z.string().nonempty({ message: "Obrigatório" }),
  logradouro: z.string().nonempty({ message: "Obrigatório" }),
  numero: z.string().nonempty({ message: "Obrigatório" }),
  complemento: z.string().optional(),
  bairro: z.string().nonempty({ message: "Obrigatório" }),
  cidade: z.string().nonempty({ message: "Obrigatório" }),
  uf: z.string().nonempty({ message: "Obrigatório" }),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  tipoConta: z.string().optional(),
  digito: z.string().optional(),
  pix: z.string().optional(),
  tipoRepasse: z.string().optional(),
  formaRepasse: z.string().optional(),
  percentualImposto: z.coerce.number().min(0).max(100).optional(),
  primeiraRepasse: z.coerce.number().min(0).max(100).optional(),
  demaisRepasse: z.coerce.number().min(0).max(100).optional(),
  grupos: z.string().optional(),
  grupoProdutor: z.string().optional(),
  liderGrupoId: z.string().optional(),
  lgpdConsentimento: z.boolean(),
  observacoes: z.string().optional(),
})

export type CreateProdutorSchema = z.infer<typeof createProdutorFormSchema>
