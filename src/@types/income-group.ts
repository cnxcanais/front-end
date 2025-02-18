import { IncomeCategory } from "./income-category"

export namespace IncomeGroup {
  export type Type = {
    income_group_id: string
    group_name: string
    created_at: Date
    updated_at: Date
    account_id: string
    income_category_id: string
    income_category: IncomeCategory.Type
  }

  export type GetRequest = {
    group_name?: string
  }

  export type GetResponse = {
    incomeGroups: Type[]
  }

  export type GetByIdResponse = {
    incomeGroup: Type
  }

  export type CreateRequest = {
    group_name: string
    income_category_id: string
  }

  export type UpdateRequest = {
    group_name: string
    income_category_id: string
  }
}
