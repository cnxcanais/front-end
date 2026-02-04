export namespace Files {
  export type Type = {
    id: string
    originalName: string
    url: string
    mimeType: string
    sizeBytes: number
    createdAt: string
  }

  export type CreateRequest = {
    entity: string
    entityId: string
    files: File[]
  }

  export type GetRequest = {
    files: Type[]
  }

  export type GetByIdResponse = {
    file: Type
  }
}
