export namespace IncomeCategory {
  export type Type = {
    income_category_id: string
    name: string
    created_at: Date
    updated_at: Date
    account_id: string
  }

  export type GetResponse = {
    incomeCategories: Type[]
  }

  export type GetByIdResponse = {
    incomeCategory: Type
  }

  export type CreateRequest = {
    name: string
    account_id: string
  }

  export type UpdateRequest = {
    income_category_id: string
    name: string
    account_id: string
  }
}
