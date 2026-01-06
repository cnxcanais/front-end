import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const updateSeguradoFormSchema = z
  .object({
    tipoPessoa: z.string().optional(),
    nomeRazaoSocial: z.string().min(3, "Nome é obrigatório"),
    grupo: z.string().min(1, "Grupo é obrigatório"),
    status: z.string().min(1, "Status é obrigatório"),
    representanteLegalNome: z.string().optional().nullable(),
    representanteLegalCpf: z.string().optional().nullable(),
    rg: z.string().optional().nullable(),
    orgaoEmissor: z.string().optional().nullable(),
    dataNascimento: z.string().optional().nullable(),
    sexo: z.string().optional().nullable(),
    estadoCivil: z.string().optional().nullable(),
    telefone: z.string().optional().nullable(),
    celular: z.string().optional().nullable(),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    cep: z.string().min(1, "CEP é obrigatório"),
    logradouro: z.string().min(1, "Logradouro é obrigatório"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional().nullable(),
    bairro: z.string().min(1, "Bairro é obrigatório"),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    uf: z.string().min(1, "UF é obrigatória"),
    nomeContato: z.string().optional().nullable(),
    cargoContato: z.string().optional().nullable(),
    ramoAtividade: z.string().optional().nullable(),
    vencimentoCnh: z.string().optional().nullable(),
    indicadoPor: z.string().optional().nullable(),
    banco: z.string().optional().nullable(),
    agencia: z.string().optional().nullable(),
    conta: z.string().optional().nullable(),
    digitoConta: z.string().optional().nullable(),
    tipoConta: z.string().optional().nullable(),
    pix: z.string().optional().nullable(),
    produtorId: z.string().min(1, "Produtor é obrigatório"),
    supervisor: z.string().optional().nullable(),
    canalVendas: z.string().optional().nullable(),
    observacoes: z.string().optional().nullable(),
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

export type UpdateSeguradoSchema = z.infer<typeof updateSeguradoFormSchema>
