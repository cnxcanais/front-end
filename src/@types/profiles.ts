export namespace Profile {
  export type Type = {
    profile_id: string
    name: string
    created_at: Date
    updated_at: Date
    account_id: string
  }

  export type GetResponse = {
    profiles: Type[]
  }

  export type GetByIdResponse = {
    profile: Type
  }

  export type CreateRequest = {
    name: string
    account_id: string
  }

  export type UpdateRequest = {
    profile_id: string
    name?: string
  }
}
