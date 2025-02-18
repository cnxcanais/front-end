import { ExpenseCategory } from "./expense-category"

export namespace ExpenseGroup {
  export type Type = {
    expense_group_id: string
    group_name: string
    created_at: Date
    updated_at: Date
    account_id: string
    expense_category_id: string
    expense_category: ExpenseCategory.Type
  }

  export type GetResponse = {
    expenseGroups: Type[]
  }

  export type GetByIdResponse = {
    expenseGroup: Type
  }

  export type CreateRequest = {
    group_name: string
    account_id: string
    expense_category_id: string
  }

  export type UpdateRequest = {
    expense_group_id: string
    expense_category_id: string
    group_name: string
    account_id: string
  }
}
