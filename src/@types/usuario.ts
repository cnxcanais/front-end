export namespace Usuario {
  export type Type = {
    id: string
    email: string
    nome: string
    senhaHash: string
    status: string
    corretoraId: string | null
    perfilId: string
    isMaster: boolean
    tokenAtivacao: string | null
    tokenAtivacaoExpira: string | null
    ativadoEm: string
    tokenRecuperacao: string | null
    tokenRecuperacaoExpira: string | null
    ultimoLogin: string
    ultimoLoginIp: string
    tentativasLogin: number
    bloqueadoAte: string | null
    createdAt: string
    createdBy: string | null
    updatedAt: string
    updatedBy: string | null
    deletedAt: string | null
    deletedBy: string | null
  }

  export type GetResponse = {
    data: {
      props: Type
    }[]
  }

  export type CreateRequest = {
    nome: string
    email: string
    perfilId: string
    corretoraId?: string | null
    isMaster: boolean
  }

  export type UpdateRequest = Omit<CreateRequest, "email" | "isMaster">
}
