export namespace Account {
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
