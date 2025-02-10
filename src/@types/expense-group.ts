export namespace ExpenseGroup {
  export type Type = {
    expense_group_id: string
    group_name: string
    created_at: Date
    updated_at: Date
    account_id: string
  }

  export type GetResponse = {
    groups: Type[]
  }

  export type GetByIdRequest = {
    expense_group_id: string
  }

  export type GetByIdResponse = {
    expenseGroup: Type
  }

  export type CreateRequest = {
    group_name: string
    account_id: string
  }

  export type DeleteRequest = {
    expense_group_id: string
  }

  export type UpdateRequest = {
    expense_group_id: string
    group_name: string
    account_id: string
  }
}
