export namespace Corretora {
  export type Type = {
    id: string
    razaoSocial: string
    nomeFantasia: string
    cnpjCpf: string
    cnpjCpfFormatado: string
    codigoSusep: string
    grupo: string
    gerente: string
    contato: string
    celular: string
    cep: string
    cepFormatado: string
    endereco: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    enderecoCompleto: string
    email: string
    telefone: string
    telefoneSecundario: string
    website: string
    percentualImposto: number
    observacoes: string
    consentimentoLgpd: boolean
    dataConsentimentoLgpd: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }

  export type GetResponse = {
    data: Type[]
    total: number
    page: number
    limit: number
    totalPages: number
  }

  export type GetByIdResponse = Type

  export type CreateRequest = {
    razaoSocial: string
    nomeFantasia: string
    cnpjCpfFormatado: string
    codigoSusep: string
    grupo: string
    gerente: string
    contato: string
    celular: string
    cepFormatado: string
    endereco: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    email: string
    telefone: string
    telefoneSecundario: string
    website: string
    percentualImposto: number
    observacoes: string
    consentimentoLgpd: boolean
  }

  export type UpdateRequest = {
    id: string
    razaoSocial: string
    nomeFantasia: string
    codigoSusep: string
    cepFormatado: string
    grupo: string
    gerente: string
    contato: string
    celular: string
    endereco: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    email: string
    telefone: string
    telefoneSecundario: string
    website: string
    percentualImposto: number
    observacoes: string
    consentimentoLgpd: boolean
  }
}
