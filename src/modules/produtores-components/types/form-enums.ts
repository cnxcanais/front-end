export enum TipoConta {
  CORRENTE = "CORRENTE",
  POUPANCA = "POUPANCA",
}

export enum TipoPessoa {
  FISICA = "FISICA",
  JURIDICA = "JURIDICA",
}

export enum TipoRepasse {
  DIRETO = "DIRETO",
  INDIRETO = "INDIRETO",
}

export enum FormaRepasse {
  NO_RECEBIMENTO = "NO_RECEBIMENTO",
  TUDO_PRIMEIRA_PARCELA = "TUDO_PRIMEIRA_PARCELA",
  ANTECIPADO_NA_PARCELA = "ANTECIPADO_NA_PARCELA",
  ANTECIPADO_TUDO_APOLICE = "ANTECIPADO_TUDO_APOLICE",
}

export enum GrupoProdutor {
  LIDER = "LIDER",
  ASSISTIDO = "ASSISTIDO",
}

export enum StatusProdutor {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
}

export enum RepasseSobre {
  PREMIO_LIQUIDO = "PREMIO_LIQUIDO",
  VALOR_FIXO = "VALOR_FIXO",
  COMISSAO_CORRETORA = "COMISSAO_CORRETORA",
}

export const TipoPessoaLabels: { text: string; value: TipoPessoa }[] = [
  { text: "Pessoa Física", value: TipoPessoa.FISICA },
  { text: "Pessoa Jurídica", value: TipoPessoa.JURIDICA },
]

export const TipoContaLabels: { text: string; value: TipoConta }[] = [
  { text: "Conta Corrente", value: TipoConta.CORRENTE },
  { text: "Conta Poupança", value: TipoConta.POUPANCA },
]

export const TipoRepasseLabels: { text: string; value: TipoRepasse }[] = [
  { text: "Repasse Direto", value: TipoRepasse.DIRETO },
  { text: "Repasse Indireto", value: TipoRepasse.INDIRETO },
]

export const FormaRepasseLabels: { text: string; value: FormaRepasse }[] = [
  { text: "No Recebimento", value: FormaRepasse.NO_RECEBIMENTO },
  { text: "Tudo Primeira Parcela", value: FormaRepasse.TUDO_PRIMEIRA_PARCELA },
  { text: "Antecipado Na Parcela", value: FormaRepasse.ANTECIPADO_NA_PARCELA },
  {
    text: "Antecipado Tudo Apólice",
    value: FormaRepasse.ANTECIPADO_NA_PARCELA,
  },
]

export const GrupoProdutorLabels: { text: string; value: GrupoProdutor }[] = [
  { text: "Produtor Líder", value: GrupoProdutor.LIDER },
  { text: "Produtor Assistido", value: GrupoProdutor.ASSISTIDO },
]

export const StatusProdutorLabels: { text: string; value: string }[] = [
  { text: "Ativo", value: StatusProdutor.ATIVO },
  { text: "Inativo", value: StatusProdutor.INATIVO },
]

export const RepasseSobreLabels: { text: string; value: string }[] = [
  { text: "Prêmio Líquido", value: RepasseSobre.PREMIO_LIQUIDO },
  { text: "Valor Fixo", value: RepasseSobre.VALOR_FIXO },
  { text: "Comissão Corretora", value: RepasseSobre.COMISSAO_CORRETORA },
]
