import { SinistroStatusEnum } from "./enums/sinistroEnum"

export namespace Sinistro {
  export type Type = {
    id: string
    numeroSinistro: string
    apoliceId: string
    tipoSinistroId: string
    emailSegurado: string
    dataHoraOcorrido: string
    descricaoOcorrido: string
    status: SinistroStatusEnum
    prestadora: string
    andamento: string
    dataUltimaTratativa: string
    responsavelUsuarioId: string
    valorEstimado: number
    valorAprovado: number
    formaPagamento: string
    dataPagamento: string
    motivoReprovacao: string
    justificativaReprovacao: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
    proposta?: {
      seguradoNome: string
      seguradoraId: string
      seguradoraNome: string
      seguradoraLogo?: string
      corretoraId: string
      corretoraNome: string
      corretoraLogo?: string
    }
    tipoSinistro?: {
      descricao: string
    }
    responsavelUsuario?: {
      nome: string
    }
  }

  export type GetResponse = {
    items: Type[]
    total: number
    page: number
    limit: number
    totalPages: number
  }

  export type PostBody = {
    numeroSinistro: string
    apoliceId: string
    tipoSinistroId: string
    emailSegurado: string
    dataHoraOcorrido: string
    descricaoOcorrido: string
    prestadora: string
    andamento: string
    dataUltimaTratativa: string
    responsavelUsuarioId: string
  }

  export type PatchBody = Partial<
    Omit<
      Type,
      | "id"
      | "numeroSinistro"
      | "apoliceId"
      | "tipoSinistroId"
      | "status"
      | "createdAt"
      | "updatedAt"
      | "createdBy"
      | "updatedBy"
    >
  >

  export type PostStatusBody = {
    statusNovo?: SinistroStatusEnum
    observacao?: string
    andamento?: string
    valorEstimado?: number
    valorAprovado?: number
    formaPagamento?: string
    dataPagamento?: string
    motivoReprovacao?: string
    justificativaReprovacao?: string
    prestadora?: string
    dataUltimaTratativa?: string
    responsavelUsuarioId?: string
  }

  export type PostObservacaoBody = {
    observacao: string
  }
}
