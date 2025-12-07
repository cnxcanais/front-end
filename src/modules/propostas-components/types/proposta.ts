import {
  ComissaoSobreEnum,
  FormaComissaoEnum,
  FormaRepasseEnum,
  OrigemEnum,
  RenovacaoEnum,
  RepasseSobreEnum,
  SituacaoEnum,
  SituacaoParcelaEnum,
  TipoDocumentoEnum,
} from "./enums"

export interface Parcela {
  id: string
  propostaApoliceId: string
  numeroParcela: number
  dataVencimento: string
  valor: string
  valorLiquido: string
  percentualCorretora: string
  previsaoRecebimento: string
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
  origem: OrigemEnum
  situacao: SituacaoEnum
  inicioVigencia: string
  fimVigencia: string
  dataEmissao?: string
  numeroApolice?: string
  numeroEndosso?: string
  renovacao?: RenovacaoEnum
  motivoNaoRenovacao?: string
  percentualComissao: number
  comissaoSobre: ComissaoSobreEnum
  formaComissao: FormaComissaoEnum
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
