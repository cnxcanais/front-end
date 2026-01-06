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
    cep: z.string().min(1, "CEP é obrigatório"),
    logradouro: z.string().min(1, "Logradouro é obrigatório"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(1, "Bairro é obrigatório"),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    uf: z.string().min(1, "UF é obrigatória"),
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
    produtorId: z.string().min(1, "Produtor é obrigatório"),
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
      if (data.tipoPessoa === "FISICA") {
        return !!data.rg
      }
      return true
    },
    {
      message: "RG é obrigatório para pessoa física",
      path: ["rg"],
    }
  )
  .refine(
    (data) => {
      if (data.tipoPessoa === "FISICA") {
        return !!data.orgaoEmissor
      }
      return true
    },
    {
      message: "Órgão emissor é obrigatório para pessoa física",
      path: ["orgaoEmissor"],
    }
  )
  .refine(
    (data) => {
      if (data.tipoPessoa === "FISICA") {
        return !!data.dataNascimento
      }
      return true
    },
    {
      message: "Data de nascimento é obrigatória para pessoa física",
      path: ["dataNascimento"],
    }
  )
  .refine(
    (data) => {
      if (data.tipoPessoa === "FISICA") {
        return !!data.sexo
      }
      return true
    },
    {
      message: "Sexo é obrigatório para pessoa física",
      path: ["sexo"],
    }
  )
  .refine(
    (data) => {
      if (data.tipoPessoa === "FISICA") {
        return !!data.estadoCivil
      }
      return true
    },
    {
      message: "Estado Civil é obrigatório para pessoa física",
      path: ["estadoCivil"],
    }
  )
  .refine(
    (data) => {
      if (data.tipoPessoa === "FISICA") {
        return !!data.vencimentoCnh
      }
      return true
    },
    {
      message: "Vencimento Cnh é obrigatório para pessoa física",
      path: ["vencimentoCnh"],
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
  .refine(
    (data) => {
      return !!data.telefone || !!data.celular
    },
    {
      message: "Preencha o telefone fixo ou o celular",
      path: ["celular"],
    }
  )

export type CreateSeguradoSchema = z.infer<typeof createSeguradoFormSchema>
