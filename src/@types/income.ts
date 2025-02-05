import { IncomeDetails } from "@/@types/income-details"
import { IncomeGroup } from "@/@types/income-group"
import { IncomeSource } from "@/@types/income-sources"

export namespace Income {
  export type GetRequest = {
    is_paid?: string
    document?: string
    start_date?: string
    end_date?: string
    organization_id?: string
    income_source_id?: string
    income_group_id?: string
  }

  export type IncomeType = {
    income_id: string
    description: string
    document: string
    date: string
    income_percentage: string
    observation: string
    income_group: IncomeGroup.Type
    income_source: IncomeSource.Type
    created_at: Date
    updated_at: Date
    account_id: string
    organization_id: string
    income_details: IncomeDetails.GetResponse
    total_amount: number
    total_parts: number
    formatted_date: string
  }

  export type GetResponse = {
    incomes: IncomeType[]
  }

  export type GetByIdRequest = {
    income_id: string
  }

  export type GetByIdResponse = {
    income: IncomeType
  }

  export type CreateResquest = {
    account_id: string
    date: Date
    description: string
    document: string
    income_group_id: string
    income_percentage: number
    income_source_id: string
    organization_id: string
  }

  export type DeleteRequest = {
    income_id: string
  }

  export type UpdateRequest = {
    income_id: string
    amount?: number
    date?: string
    description?: string
    document?: string
    income_group_id?: string
    income_percentage?: number
    income_source_id?: string
    organization_id?: string
  }
}
