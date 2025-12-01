import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const updateSeguradoFormSchema = z
  .object({
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
    cep: z.string().optional().nullable(),
    logradouro: z.string().optional().nullable(),
    numero: z.string().optional().nullable(),
    complemento: z.string().optional().nullable(),
    bairro: z.string().optional().nullable(),
    cidade: z.string().optional().nullable(),
    uf: z.string().optional().nullable(),
    nomeContato: z.string().optional().nullable(),
    cargoContato: z.string().optional().nullable(),
    ramoAtividade: z.string().optional().nullable(),
    vencimentoCnh: z.string().min(1, "Vencimento da CNH é obrigatório"),
    indicadoPor: z.string().optional().nullable(),
    banco: z.string().optional().nullable(),
    agencia: z.string().optional().nullable(),
    conta: z.string().optional().nullable(),
    digitoConta: z.string().optional().nullable(),
    tipoConta: z.string().optional().nullable(),
    pix: z.string().optional().nullable(),
    produtorId: z.string().optional().nullable(),
    supervisor: z.string().optional().nullable(),
    canalVendas: z.string().optional().nullable(),
    observacoes: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      // Check if this is JURIDICA type by looking at representanteLegalNome requirements
      // In edit, we need to check if this should be required
      if (
        data.representanteLegalNome !== undefined &&
        data.representanteLegalNome !== null &&
        data.representanteLegalNome !== ""
      ) {
        return !!data.representanteLegalCpf
      }
      return true
    },
    {
      message:
        "CPF do representante legal é obrigatório quando o nome é informado",
      path: ["representanteLegalCpf"],
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

export type UpdateSeguradoSchema = z.infer<typeof updateSeguradoFormSchema>
