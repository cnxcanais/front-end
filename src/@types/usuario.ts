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

    totalPages: number
    totalItems: number
    currentPage: number
    itemsPerPage: number
  }

  export type AuthResponse = {
    accessToken: string
    refreshToken: string
    expiresIn: number
    usuario: {
      id: string
      nome: string
      email: string
      status: string
      perfil: {
        id: string
        nome: string
      }
      corretora?: {
        id: string
        razaoSocial: string
      }
      produtor?: {
        id: string
        nome: string
      }
      isMaster: boolean
    }
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
