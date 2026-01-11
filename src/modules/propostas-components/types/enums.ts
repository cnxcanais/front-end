export enum TipoDocumentoEnum {
  PROPOSTA = "Proposta",
  APOLICE = "Apólice",
  RENOVACAO = "Renovação",
  ENDOSSO = "Endosso",
}

export enum OrigemEnum {
  MANUAL = "Manual",
  IMPORTACAO = "Importação",
  INTEGRACAO = "Integração",
}

export enum SituacaoEnum {
  ATIVO = "Ativo",
  INATIVO = "Inativo",
  RECUSADA = "Recusada",
  RENOVADA = "Renovada",
  NAO_RENOVADA = "Não Renovada",
  CANCELADA = "Cancelada",
}

export enum RenovacaoEnum {
  RENOVAVEL = "Renovável",
  NAO_RENOVAVEL = "Não Renovável",
}

export enum ComissaoSobreEnum {
  PREMIO_LIQUIDO = "Premio Liquido",
}

export const comissaoSobreOptions = [
  {
    text: ComissaoSobreEnum.PREMIO_LIQUIDO,
    value: ComissaoSobreEnum.PREMIO_LIQUIDO,
  },
]

export enum FormaComissaoEnum {
  NA_PARCELA = "Na Parcela",
  ANTECIPADO = "Antecipado",
}

export const formaComissaoOptions = [
  {
    text: FormaComissaoEnum.NA_PARCELA,
    value: FormaComissaoEnum.NA_PARCELA,
  },
  {
    text: FormaComissaoEnum.ANTECIPADO,
    value: FormaComissaoEnum.ANTECIPADO,
  },
]

export enum SituacaoParcelaEnum {
  PENDENTE = "Pendente",
  PAGO = "Pago",
  VENCIDO = "Vencido",
  CANCELADO = "Cancelado",
}

export enum RepasseSobreEnum {
  PREMIO_LIQUIDO = "Premio Liquido",
  COMISSAO_CORRETORA = "Comissão da Corretora",
  VALOR_FIXO = "Valor Fixo",
}

export enum FormaRepasseEnum {
  NO_RECEBIMENTO = "No recebimento",
}

export const formaRepasseOptions = [
  {
    text: FormaRepasseEnum.NO_RECEBIMENTO,
    value: FormaRepasseEnum.NO_RECEBIMENTO,
  },
]
