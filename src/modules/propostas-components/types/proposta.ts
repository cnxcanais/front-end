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
  numeroParcela: number
  dataVencimento: string
  valor: number
  valorLiquido: number
  percentualCorretora: number
  previsaoRecebimento: string
  situacao: SituacaoParcelaEnum
}

export interface Repasse {
  produtorId: string
  percentualRepasse: number
  repasseSobre: RepasseSobreEnum
  formaRepasse: FormaRepasseEnum
}

export interface Proposta {
  _id: string
  _numeroProposta: string
  _seguradoId: string
  _corretoraId: string
  _produtorId: string
  _seguradoraId: string
  _ramoId: string
  _produtoId?: string
  _placaVeiculo?: string
  _chassiVeiculo?: string
  _modeloVeiculo?: string
  _marcaVeiculo?: string
  _anoFabricacaoVeiculo?: number
  _anoModeloVeiculo?: number
  _complementoItem?: string
  _tipoDocumento: TipoDocumentoEnum
  _origem: OrigemEnum
  _situacao: SituacaoEnum
  _inicioVigencia: string
  _fimVigencia: string
  _dataEmissao?: string
  _numeroApolice?: string
  _numeroEndosso?: string
  _renovacao?: RenovacaoEnum
  _motivoNaoRenovacao?: string
  _percentualComissao: string | number
  _comissaoSobre: ComissaoSobreEnum
  _formaComissao: FormaComissaoEnum
  _valorComissao: string | number
  _premioLiquido: string | number
  _valoresAdicionais?: string | number
  _iof?: string | number
  _premioTotal?: string | number
  _parcelas?: Parcela[]
  _repasses?: Repasse[]
  _createdAt: string
  _updatedAt: string
  _deletedAt?: string | null
  _createdBy?: string | null
  _updatedBy?: string | null
  _deletedBy?: string | null
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
