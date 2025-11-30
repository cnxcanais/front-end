import { z } from "zod"

export const updateSeguradoFormSchema = z
  .object({
    nomeRazaoSocial: z.string().min(3, "Nome é obrigatório"),
    grupo: z.string().min(1, "Grupo é obrigatório"),
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

export type UpdateSeguradoSchema = z.infer<typeof updateSeguradoFormSchema>
