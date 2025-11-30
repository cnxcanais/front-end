export namespace Segurado {
  export type Type = {
    id: string
    tipoPessoa: "FISICA" | "JURIDICA"
    nomeRazaoSocial: string
    cnpjCpf: string
    grupo: string
    corretoraId: string
    status: "ATIVO" | "INATIVO"
    representanteLegalNome: string | null
    representanteLegalCpf?: string
    rg: string
    orgaoEmissor: string
    dataNascimento: string
    sexo: string
    estadoCivil: string
    telefone: string
    celular: string
    email: string
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    enderecoCompleto: string
    nomeContato: string
    cargoContato: string
    ramoAtividade: string
    vencimentoCnh: string
    indicadoPor: string
    banco: string
    agencia: string
    conta: string
    digitoConta: string
    tipoConta: string
    pix: string
    produtorId: string
    supervisor: string
    canalVendas: string
    observacoes: string
    createdAt: string
    createdBy: string | null
    updatedAt: string
    updatedBy: string | null
    deletedAt: string | null
    deletedBy: string | null
  }

  export type GetResponse = {
    data: Type[]
    total: number
    page: number
    limit: number
    totalPages: number
  }

  export type GetByIdResponse = Type

  export type CreateRequest = Omit<
    Type,
    "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "deletedAt" | "deletedBy" | "enderecoCompleto"
  >

  export type UpdateRequest = Omit<
    Type,
    "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "deletedAt" | "deletedBy" | "enderecoCompleto" | "tipoPessoa" | "cnpjCpf" | "corretoraId"
  >
}
