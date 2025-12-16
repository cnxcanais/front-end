export namespace Seguradora {
  export type Type = {
    id: string
    razaoSocial: string
    cnpj: string
    codigoSusep: string
    fantasia: string
    grupoEconomicoId: string
    impostoRetido: number
    habilitarJuros: boolean
    calculoDesconto: string
    calculoDescontoPadrao: boolean
    diretor: string
    gerente: string
    website: string
    email: string
    telefone: string
    telefoneSecundario: string
    telefoneAssistencia24h: string
    observacoes: string
    cep: string
    cepFormatado: string
    endereco: string
    numero: string
    bairro: string
    cidade: string
    uf: string
    complemento: string
    createdAt: string
    updatedAt: string
    logoUrl: string
  }

  export type GetResponse = {
    data: Type[]
    total: number
    page: number
    limit: number
    totalPages: number
  }

  export type GetByIdResponse = Type

  export type CreateRequest = Omit<Type, "id" | "createdAt" | "updatedAt">

  export type UpdateRequest = Omit<Type, "createdAt" | "updatedAt">
}
