import { IncomeDetails } from "@/@types/income-details"

export namespace Income {
  export type GetRequest = {
    account_id: string
    document?: string
    start_date?: string
    end_date?: string
    organization_id?: string
    income_source_id?: string
    income_group_id?: string
  }

  export type GetResponse = {
    incomes: {
      income_id: string
      description: string
      document: string
      date: Date
      income_percentage: string
      observation: string
      income_group_id: string
      income_source_id: string
      created_at: Date
      updated_at: Date
      account_id: string
      organization_id: string
      income_details: IncomeDetails.GetResponse
    }[]
  }

  export type GetByIdRequest = {
    income_id: string
  }

  export type GetByIdResponse = {
    income: {
      income_id: string
      description: string
      document: string
      date: Date
      income_percentage: string
      observation: string
      income_group_id: string
      income_source_id: string
      created_at: Date
      updated_at: Date
      account_id: string
      organization_id: string
      income_details: IncomeDetails.GetResponse
    }
  }

  export type CreateResquest = {
    account_id: string
    amount: number
    date: Date
    description: string
    document: string
    income_group_id: string
    income_percentage: number
    income_source_id: string
    organization_id: string
    parts_qty: number
  }

  export type DeleteRequest = {
    income_id: string
  }

  export type UpdateRequest = {
    income_id: string
    amount?: number
    date?: Date
    description?: string
    document?: string
    income_group_id?: string
    income_percentage?: number
    income_source_id?: string
    organization_id?: string
    parts_qty?: number
  }
}
