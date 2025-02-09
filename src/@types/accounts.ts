export namespace Account {
  export type Type = {
    account_id: string
    name: string
    enabled: boolean
    master_mode: boolean
    created_at: Date
    updated_at: Date
  }

  export type GetRequest = {
    accounts: Type[]
  }

  export type GetByIdRequest = {
    account: Type
  }

  export type CreateRequest = {
    name: string
  }

  export type UpdateRequest = {
    account_id: string
    name: string
    enabled: boolean
    master_mode?: boolean
  }
}
