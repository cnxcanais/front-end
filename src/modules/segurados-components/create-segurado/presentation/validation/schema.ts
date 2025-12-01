import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const createSeguradoFormSchema = z
  .object({
    tipoPessoa: z.string().min(1, "Tipo de pessoa é obrigatório"),
    nomeRazaoSocial: z.string().min(3, "Nome é obrigatório"),
    cnpjCpf: z.string().min(11, "CPF/CNPJ é obrigatório"),
    grupo: z.string().min(1, "Grupo é obrigatório"),
    corretoraId: z.string().min(1, "Corretora é obrigatória"),
    status: z.string().min(1, "Status é obrigatório"),
    representanteLegalNome: z.string().optional(),
    representanteLegalCpf: z.string().optional(),
    rg: z.string().optional(),
    orgaoEmissor: z.string().optional(),
    dataNascimento: z.string().optional(),
    sexo: z.string().optional(),
    estadoCivil: z.string().optional(),
    telefone: z.string().optional(),
    celular: z.string().optional(),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    cep: z.string().optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    nomeContato: z.string().optional(),
    cargoContato: z.string().optional(),
    ramoAtividade: z.string().optional(),
    vencimentoCnh: z.string().min(1, "Vencimento da CNH é obrigatório"),
    indicadoPor: z.string().optional(),
    banco: z.string().optional(),
    agencia: z.string().optional(),
    conta: z.string().optional(),
    digitoConta: z.string().optional(),
    tipoConta: z.string().optional(),
    pix: z.coerce.string().optional(),
    produtorId: z.string().optional(),
    supervisor: z.string().optional(),
    canalVendas: z.string().optional(),
    observacoes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.tipoPessoa === "JURIDICA") {
        return !!data.representanteLegalNome && !!data.representanteLegalCpf
      }
      return true
    },
    {
      message:
        "Nome e CPF do representante legal são obrigatórios para pessoa jurídica",
      path: ["representanteLegalNome"],
    }
  )
  .refine(
    (data) => {
      const cleanedDocument = data.cnpjCpf.replace(/\D/g, "")
      if (cleanedDocument.length === 11) return validateCPF(cleanedDocument)
      if (cleanedDocument.length === 14) return validateCNPJ(cleanedDocument)
      return false
    },
    {
      message: "CPF ou CNPJ inválido",
      path: ["cnpjCpf"],
    }
  )
  .refine(
    (data) => {
      if (data.representanteLegalCpf) {
        const cleanedDocument = data.representanteLegalCpf.replace(/\D/g, "")
        if (cleanedDocument.length === 11) return validateCPF(cleanedDocument)
        if (cleanedDocument.length === 14) return validateCNPJ(cleanedDocument)
      }
      return true
    },
    {
      message: "CPF ou CNPJ inválido",
      path: ["representanteLegalCpf"],
    }
  )

export type CreateSeguradoSchema = z.infer<typeof createSeguradoFormSchema>
