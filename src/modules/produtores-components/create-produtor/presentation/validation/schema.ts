import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const createProdutorFormSchema = z.object({
  nome: z.string().nonempty({ message: "Obrigatório" }).max(255),
  situacao: z.string().nonempty({ message: "Obrigatório" }).max(20),
  pessoa: z.string().nonempty({ message: "Obrigatório" }).max(10),
  cnpjCpf: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(14)
    .refine(
      (value) => {
        const cleanValue = value.replace(/\D/g, "")
        if (cleanValue.length === 11) return validateCPF(cleanValue)
        if (cleanValue.length === 14) return validateCNPJ(cleanValue)
        return false
      },
      { message: "CPF/CNPJ inválido" }
    ),
  homePage: z.string().max(255).optional(),
  telefoneComercial: z.string().max(11).optional(),
  contaContabil: z.string().max(50).optional(),
  repasseSobre: z.string().max(50).optional(),
  excluirRepasse: z.boolean(),
  corretoraId: z.string().nonempty({ message: "Obrigatório" }),
  inscricaoEstadual: z.string().max(50).optional(),
  inscricaoMunicipal: z.string().max(50).optional(),
  telefoneFixo: z.string().max(11).optional(),
  telefoneCelular: z.string().nonempty({ message: "Obrigatório" }).max(11),
  email: z.string().email({ message: "Email inválido" }).max(255),
  cep: z.string().nonempty({ message: "Obrigatório" }).max(8),
  logradouro: z.string().nonempty({ message: "Obrigatório" }).max(255),
  numero: z.string().nonempty({ message: "Obrigatório" }).max(10),
  complemento: z.string().max(100).optional(),
  bairro: z.string().nonempty({ message: "Obrigatório" }).max(100),
  cidade: z.string().nonempty({ message: "Obrigatório" }).max(100),
  uf: z.string().nonempty({ message: "Obrigatório" }).max(2),
  banco: z.string().max(100).optional(),
  agencia: z.string().max(10).optional(),
  conta: z.string().max(20).optional(),
  tipoConta: z.string().max(20).optional(),
  digitoConta: z.string().max(2).optional(),
  pix: z.string().max(100).optional(),
  tipoRepasse: z.string().max(20).optional(),
  formaRepasse: z.string().max(20).optional(),
  percentualImposto: z
    .string()
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(0).max(100).optional()),
  primeiraRepasse: z
    .string()
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(0).max(100).optional()),
  demaisRepasse: z
    .string()
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(0).max(100).optional()),
  grupos: z.string().max(255).optional(),
  grupoProdutor: z.string().max(50).optional(),
  liderGrupoId: z.string().optional(),
  lgpdConsentimento: z.boolean(),
  observacoes: z.string().optional(),
})

export type CreateProdutorSchema = z.infer<typeof createProdutorFormSchema>
