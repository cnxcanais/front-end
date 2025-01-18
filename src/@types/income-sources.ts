export namespace IncomeSource {
  export type GetRequest = {
    income_group_id: string
    group_name: string
    account_id: string
    created_at: Date
    updated_at: Date
  }

  export type CreateRequest = {
    group_name: string
    account_id: string
  }

  export type UpdateRequest = {
    group_name: string
  }
}
