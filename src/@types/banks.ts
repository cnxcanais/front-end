export namespace Bank {
  export type GetResponse = {
    banks: {
      bank_id: string
      name: string
      created_at: Date
      updated_at: Date
      account_id: string
      bank_account: any // TODO: update this type later
      bank_number: number
    }[]
  }

  export type GetByIdResponse = {
    bank: {
      bank_id: string
      name: string
      created_at: Date
      updated_at: Date
      account_id: string
      bank_account: any // TODO: update this type later
      bank_number: number
    }
  }

  export type CreateRequest = {
    name: string
    account_id: string
    bank_number: number
  }

  export type UpdateRequest = {
    name: string
    bank_number: number
  }

  export type DeleteRequest = {
    bank_id: string
  }
}
