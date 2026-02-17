export namespace Repasse {
  export type Situacao = "PENDENTE" | "PARCIAL" | "PAGO" | "CANCELADO" | "ESTORNADO"
  export type Metodo = "Manual" | "Lote" | "Importado"
  export type TipoBase = "Premio Liquido" | "Comissão da Corretora" | "Valor Fixo"

  export type Type = {
    id: string
    comissaoId: string
    produtorId: string
    produtorNome: string
    apoliceId: string
    numeroApolice: string
    parcelaId: string
    numeroParcela: string
    comissaoRecebida: number
    baseCalculo: TipoBase
    percentual: number | null
    valorFixo: number | null
    valorTotal: number
    valorPago: number
    valorPendente: number
    situacao: Situacao
    diasAtraso: number
    nivelCadeia: number
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
