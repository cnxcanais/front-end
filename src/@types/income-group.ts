export namespace IncomeGroup {
  export type Response = {
    incomeGroups: Type[]
  }

  export type Type = {
    expense_group_id: string
    group_name: string
    created_at: Date
    updated_at: Date
    account_id: string
  }

  export type Request = {
    group_name: string
    account_id: string
  }

  export type Update = {
    group_name: string
  }
}
