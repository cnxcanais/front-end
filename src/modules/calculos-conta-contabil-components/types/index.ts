export namespace CalculoContaContabil {
  export interface ValoresCalculo {
    somaRepasses: number
    valorContaContabil: number
    valorImposto: number
    percentualRepasseAplicado: number | null
    percentualImpostoAplicado: number | null
  }

  export interface Produtor {
    produtorId: string
    nome: string
    pago: ValoresCalculo
    provisionado: ValoresCalculo
  }

  export interface TotalProvisionado {
    totalConta: number
    impostoTotal: number
    valorLiquido: number
  }

  export interface ContaContabil {
    contaContabilId: string
    codigo: string
    descricao: string
    produtores: Produtor[]
    totalProvisionado: TotalProvisionado
  }

  export interface Response {
    ano: number
    mes: number
    total: number
    pagina: number
    limite: number
    totalPaginas: number
    contasContabeis: ContaContabil[]
  }

  export interface Filters {
    ano: number
    mes: number
    corretoraId?: string
    contaContabilId?: string
    situacao?: "PAGO" | "PROVISIONADO"
    produtorId?: string
    pagina?: number
    limite?: number
  }
}
