export namespace BankAccount {
  export type Type = {
    bank_account_id: string
    agency: string
    observation: string
    created_at: Date
    updated_at: Date
    bank_id: string
    account_number: string
  }

  export type GetResponse = {
    bankAccounts: Type[]
  }

  export type GetByIdResponse = {
    bankAccount: Type
  }

  export type CreateRequest = {
    agency: string
    observation: string
    account_number: string
    bank_id: string
  }

  export type UpdateRequest = {
    agency: string
    observation: string
    account_number: string
    bank_id: string
  }
}
