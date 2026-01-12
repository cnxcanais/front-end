import {
  ComissaoSobreEnum,
  FormaComissaoEnum,
  FormaRepasseEnum,
  RepasseSobreEnum,
  SituacaoEnum,
  SituacaoParcelaEnum,
  TipoDocumentoEnum,
} from "../modules/propostas-components/types/enums"

export interface Parcela {
  id: string
  propostaApoliceId: string
  numeroParcela: number
  dataVencimento: string
  valor: string
  percentualComissao: string
  previsaoPagamento: string
  situacao: SituacaoParcelaEnum
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: string | null
  updatedBy: string | null
  deletedBy: string | null
}

export interface Repasse {
  id: string
  propostaApoliceId: string
  produtorId: string
  percentualRepasse: string
  valorRepasse: string
  repasseSobre: RepasseSobreEnum
  formaRepasse: FormaRepasseEnum
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: string | null
  updatedBy: string | null
  deletedBy: string | null
}

export interface Proposta {
  id: string
  numeroProposta: string
  seguradoId: string
  corretoraId: string
  produtorId: string
  seguradoraId: string
  ramoId: string
  produtoId?: string
  placaVeiculo?: string
  chassiVeiculo?: string
  modeloVeiculo?: string
  marcaVeiculo?: string
  anoFabricacaoVeiculo?: number
  anoModeloVeiculo?: number
  complementoItem?: string
  tipoDocumento: TipoDocumentoEnum
  tomadorId?: string
  propostaOriginalId?: string
  apoliceRaiz?: string
  ultimoEndossoId?: string
  possuiEndossoMaisRecente: boolean
  dataCancelamento?: string
  motivoCancelamento?: string
  origem?: "Manual" | "Importação" | "Integração"
  tomadorNome?: string
  numeroVersao?: number
  situacao: SituacaoEnum
  inicioVigencia: string
  fimVigencia: string
  dataEmissao?: string
  numeroApolice?: string
  motivoNaoRenovacao?: string
  percentualComissao: number
  comissaoSobre: ComissaoSobreEnum
  formaComissao: FormaComissaoEnum
  produtoRenovavel: boolean
  valorComissao: number
  premioLiquido: number
  valoresAdicionais?: number
  iof?: number
  premioTotal?: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: string | null
  updatedBy: string | null
  deletedBy: string | null
  seguradoNome?: string
  corretoraNome?: string
  produtorNome?: string
  seguradoraNome?: string
  ramoNome?: string
  produtoNome?: string
  parcelas?: Parcela[]
  repasses?: Repasse[]
  observacoes?: string
}

export interface PropostasResponse {
  data: Proposta[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface UltimoEndossoResponse {
  isUltimaVersa: boolean
  documentoAtual: {
    id: string
    numeroProposta: string
    numeroVersao: number
    possuiEndossoMaisRecente: boolean
    ultimoEndossoId: string | null
  }
  ultimaVersao: {
    id: string
    numeroProposta: string
    numeroVersao: number
    possuiEndossoMaisRecente: boolean
  }
  totalEndossos: number
  cadeia: {
    id: string
    numeroProposta: string
    numeroVersao: number
  }[]
}
