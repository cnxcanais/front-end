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
}

export enum RenovacaoEnum {
  RENOVAVEL = "Renovável",
  NAO_RENOVAVEL = "Não Renovável",
}

export enum ComissaoSobreEnum {
  PREMIO_LIQUIDO = "Premio Liquido",
  COMISSAO_CORRETORA = "Comissão da Corretora",
  VALOR_FIXO = "Valor Fixo",
}

export enum FormaComissaoEnum {
  NA_PARCELA = "Na Parcela",
  ANTECIPADO = "Antecipado",
  RECORRENCIA = "Recorrencia",
}

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
  ANTECIPADO_1A_PARCELA = "Antecipado 1a parcela",
  ANTECIPADO_PARCELA = "Antecipado parcela",
  ANTECIPADO_EMISSAO = "Antecipado emissão",
}
