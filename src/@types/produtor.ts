export namespace Produtor {
  export type Type = {
    id: string
    nome: string
    situacao: string
    pessoa: string
    cnpjCpf: string
    homePage: string
    telefoneComercial: string
    contaContabilId: string
    repasseSobre: string
    excluirRepasse: boolean
    corretoraId: string
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
    percentualRepasse: number
    valorRepasse: number
    grupos: string
    lgpdConsentimento: boolean
    lgpdConsentimentoData: string
    createdAt: string
    updatedAt: string
    digitoConta: string
    produtorIndicadorId: string
    percentualRepasseIndicacao: number
    valorRepasseIndicacao: number
    repasseSobreIndicacao: string
    formaRepasseIndicacao: string
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

  export type UpdateRequest = Omit<Type, "id" | "createdAt" | "updatedAt">
}
