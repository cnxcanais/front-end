export namespace Perfil {
  export type Type = {
    id: string
    nome: string
    descricao: string
    isSistema: boolean
    createdAt: string
    updatedAt: string
  }

  export type GetResponse = {
    data: Type[]
    total: number
    page: number
    limit: number
    totalPages: number
  }

  export type CreateRequest = Omit<Type, "createdAt" | "updatedAt" | "id">

  export type UpdateRequest = Omit<
    Type,
    "createdAt" | "updatedAt" | "id" | "isSistema"
  >
}
