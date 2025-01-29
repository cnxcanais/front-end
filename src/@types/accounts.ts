export namespace Account {
  export type GetRequest = {
    accounts: {
      account_id: string
      name: string
      enabled: boolean
      master_mode: boolean
      created_at: Date
      updated_at: Date
    }[]
  }

  export type GetByIdRequest = {
    account: {
      account_id: string
      name: string
      enabled: boolean
      master_mode: boolean
      created_at: Date
      updated_at: Date
    }
  }

  export type CreateRequest = {
    name: string
  }

  export type DeleteRequest = {
    account_id: string
  }

  export type UpdateRequest = {
    account_id: string
    name: string
    enabled: boolean
    master_mode?: boolean
  }
}
