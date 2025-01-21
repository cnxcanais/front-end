export namespace Account {
  export type GetRequest = {
    accounts: {
      accountId: string
      name: string
      enabled: boolean
    }[]
  }

  export type GetByIdRequest = {
    account: {
      accountId: string
      name: string
      enabled: boolean
    }
  }

  export type CreateRequest = {
    name: string
  }

  export type DeleteRequest = {
    accountId: string
  }

  export type UpdateRequest = {
    accountId: string
    name: string
    enabled: boolean
  }
}
