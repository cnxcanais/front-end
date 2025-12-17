export namespace Perfil {
  export type Type = {
    id: string
    nome: string
    descricao: string
    isSistema: boolean
    createdAt: string
    updatedAt: string
  }

  export type GetResponse = Type[]

  export type CreateRequest = Omit<Type, "createdAt" | "updatedAt" | "id">

  export type UpdateRequest = Omit<
    Type,
    "createdAt" | "updatedAt" | "id" | "isSistema"
  >
}
