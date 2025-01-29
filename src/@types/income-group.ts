export namespace IncomeGroup {
  export type GetRequest = {
    account_id: string
    group_name?: string
  }

  export type GetResponse = {
    incomeGroups: {
      income_group_id: string
      group_name: string
      created_at: Date
      updated_at: Date
      account_id: string
    }[]
  }

  export type GetByIdRequest = {
    income_group_id: string
  }

  export type GetByIdResponse = {
    incomeGroup: {
      income_group_id: string
      group_name: string
      created_at: Date
      updated_at: Date
      account_id: string
    }
  }

  export type CreateRequest = {
    group_name: string
  }

  export type DeleteRequest = {
    income_group_id: string
  }

  export type UpdateRequest = {
    group_name: string
  }
}
