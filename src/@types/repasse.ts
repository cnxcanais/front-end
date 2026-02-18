export namespace Repasse {
  export type Situacao = "PENDENTE" | "PARCIAL" | "PAGO" | "CANCELADO" | "ESTORNADO"
  export type Metodo = "Manual" | "Lote" | "Importado"
  export type TipoBase = "Premio Liquido" | "Comissão da Corretora" | "Valor Fixo"

  export type Type = {
    id: string
    propostaApoliceId: string
    parcelaId: string
    comissaoId: string
    produtorId: string
    valorBaseRepasse: number
    valorRepasse: number
    percentualAplicado: number
    repasseSobre: string
    nivelCadeia: number
    produtorIdIndicacao: string | null
    valorIntegral: number
    saldoAnterior: number | null
    isCalculoParcial: boolean
    isCalculoFinal: boolean
    isEditadoManualmente: boolean
    isLastroZero: boolean
    situacao: string
    dataPagamento: string | null
    dataCancelamento: string | null
    repasseEstornadoId: string | null
    isEstornoRevertido: boolean
    createdBy: string
    createdAt: string
    updatedBy: string | null
    updatedAt: string | null
    deletedBy: string | null
    deletedAt: string | null
  }

  export type GetResponse = {
    data: Type[]
    total: number
    page: number
    limit: number
    totalPages: number
  }

  export type BaixaRequest = {
    repasseId: string
    valorPago: number
    dataPagamento: string
    metodo: Metodo
    referenciaBancaria?: string
    observacao?: string
  }

  export type BaixaLoteRequest = {
    repasseIds: string[]
    dataPagamento: string
    metodo: Metodo
    referenciaBancaria?: string
    observacao?: string
  }

  export type EstornoRequest = {
    repasseId: string
    valorEstorno: number
    motivo: string
  }

  export type HistoricoItem = {
    id: string
    repasseId: string
    tipo: "BAIXA" | "CRIACAO" | "CANCELAMENTO" | "ESTORNO"
    valorPago: number
    situacaoAnterior: Situacao | null
    situacaoNova: Situacao
    dataPagamento: string
    metodo: Metodo
    referenciaBancaria: string | null
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

  export type CadeiaItem = {
    nivel: number
    produtorId: string
    produtorNome: string
    baseCalculo: TipoBase
    percentual: number | null
    valorFixo: number | null
    valorTotal: number
    valorPago: number
    valorPendente: number
    situacao: Situacao
  }
}
