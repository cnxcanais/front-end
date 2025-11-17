export namespace Produtor {
  export type Type = {
    id: string
    nome: string
    situacao: string
    pessoa: string
    cnpjCpf: string
    homePage: string
    telefoneComercial: string
    contaContabil: string
    repasseSobre: string
    excluirRepasse: boolean
    corretoraId: string
    inscricaoEstadual: string
    inscricaoMunicipal: string
    telefoneFixo: string
    telefoneCelular: string
    email: string
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    observacoes: string
    banco: string
    agencia: string
    conta: string
    tipoConta: string
    pix: string
    tipoRepasse: string
    formaRepasse: string
    percentualImposto: number
    primeiraRepasse: number
    demaisRepasse: number
    grupos: string
    grupoProdutor: string
    liderGrupoId: string
    lgpdConsentimento: boolean
    lgpdConsentimentoData: string
    createdAt: string
    updatedAt: string
    digitoConta: string
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
