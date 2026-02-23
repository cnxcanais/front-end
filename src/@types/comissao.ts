export namespace Comissao {
  export type Situacao =
    | "Simulada"
    | "Provisionada"
    | "Pendente"
    | "Paga"
    | "Cancelada"

  // Backend API response
  export type ApiType = {
    id: string
    propostaApoliceId: string
    parcelaId: string
    valorBaseComissao: number
    valorComissao: number
    situacao: Situacao
    dataPagamento: string | null
    dataCancelamento: string | null
    isRepasseCalculado: boolean
    comissaoEstornadaId: string | null
    isEstornoRevertido: boolean
    createdBy: string
    createdAt: string
    updatedBy: string | null
    updatedAt: string | null
    deletedBy: string | null
    deletedAt: string | null
    parcela: {
      id: string
      propostaApoliceId: string
      numeroParcela: number
      dataVencimento: string
      valor: string
      percentualComissao: string
      previsaoPagamento: string
      situacao: string
      createdAt: string
      updatedAt: string
    }
    propostaApolice: {
      id: string
      numeroProposta: string
      numeroApolice: string
      tipoDocumento: string
      situacao: string
      inicioVigencia: string
      fimVigencia: string
      premioLiquido: string
      premioTotal: string
    }
  }

  // Frontend enriched type
  export type Type = ApiType & {
    seguradoNome: string
    numeroApolice: string
    numeroParcela: string
    dataVencimento: string
    premioLiquido: number
    comissaoTotal: number
    valorPago: number
    valorPendente: number
    diasAtraso: number
    corretoraId: string
    corretoraNome: string
    seguradoraId: string
    seguradoraNome: string
  }

  export type GetResponse = {
    data: ApiType[]
    total: number
    page: number
    limit: number
    totalPages: number
  }

  export type CalcularRequest = {
    propostaApoliceId?: string
  }

  export type AtualizarValorRequest = {
    novoValor: number
  }

  export type PagamentoRequest = {
    dataPagamento: string
  }
}
