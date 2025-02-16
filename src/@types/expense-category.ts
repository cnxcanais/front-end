export namespace ExpenseCategory {
  export type Type = {
    expense_category_id: string
    name: string
    created_at: Date
    updated_at: Date
    account_id: string
  }

  export type GetResponse = {
    expenseCategories: Type[]
  }

  export type GetByIdResponse = {
    expenseCategory: Type
  }

  export type CreateRequest = {
    name: string
    account_id: string
  }

  export type UpdateRequest = {
    expense_category_id: string
    name: string
    account_id: string
  }
}
