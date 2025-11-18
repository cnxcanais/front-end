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
  DEPOSITO = "DEPOSITO",
  TED = "TED",
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
  PREMIO_BRUTO = "PREMIO_BRUTO",
  COMISSAO = "COMISSAO",
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
  { text: "Depósito", value: FormaRepasse.DEPOSITO },
  { text: "TED", value: FormaRepasse.TED },
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
  { text: "Prêmio Bruto", value: RepasseSobre.PREMIO_BRUTO },
  { text: "Comissão", value: RepasseSobre.COMISSAO },
]
