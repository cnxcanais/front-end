export namespace Comissao {
  export type Situacao = "PENDENTE" | "PARCIAL" | "PAGA" | "CANCELADA"
  export type Metodo = "Manual" | "Lote" | "Importado"

  export type Type = {
    id: string
    apoliceId: string
    parcelaId: string
    seguradoNome: string
    numeroApolice: string
    numeroParcela: string
    dataVencimento: string
    premioLiquido: number
    comissaoTotal: number
    valorPago: number
    valorPendente: number
    situacao: Situacao
    diasAtraso: number
    corretoraId: string
    corretoraNome: string
    seguradoraId: string
    seguradoraNome: string
    createdAt: string
    updatedAt: string
  }

  export type GetResponse = {
    items: Type[]
    total: number
    page: number
    limit: number
    totalPages: number
  }

  export type BaixaRequest = {
    comissaoId: string
    valorPago: number
    dataPagamento: string
    metodo: Metodo
    observacao?: string
  }

  export type BaixaLoteRequest = {
    comissaoIds: string[]
    dataPagamento: string
    metodo: Metodo
    observacao?: string
  }

  export type HistoricoItem = {
    id: string
    comissaoId: string
    tipo: "BAIXA" | "CRIACAO" | "CANCELAMENTO" | "ESTORNO"
    valorPago: number
    situacaoAnterior: Situacao | null
    situacaoNova: Situacao
    dataPagamento: string
    metodo: Metodo
    observacao: string | null
    usuarioId: string
    usuarioNome: string
    createdAt: string
  }

  export type Indicadores = {
    totalPendente: number
    totalPagoMes: number
    totalVencido: number
    aging: {
      ate30: number
      de31a60: number
      de61a90: number
      acima90: number
    }
  }
}
