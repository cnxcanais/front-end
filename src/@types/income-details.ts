export namespace IncomeDetails {
  export type IncomeDetailsType = {
    income_details_id: string
    observation: string
    amount: string
    part: number
    due_date: Date
    is_paid: boolean
    bank_account_id: string
    income_id: string
    account_id: string
  }

  export type GetRequest = {
    start_date?: string | Date
    end_date?: string | Date
    is_paid?: boolean
    bank_account_id?: string
    page?: number
    income_id?: string
  }

  export type GetResponse = {
    incomeDetails: IncomeDetailsType[] | []
    totalPages: number
  }

  export type GetbyIdResponse = {
    incomeDetails: IncomeDetailsType
  }

  export type CreateRequest = {
    amount: number
    bank_account_id: string
    part: number
    due_date: Date
    income_id: string
    account_id: string
    observation: string
  }

  export type DeleteRequest = {
    income_details_id: string
  }

  export type UpdateRequest = {
    amount?: number
    bank_account_id?: string
    part?: number
    due_date?: string
    income_id?: string
    observation?: string
    is_paid?: boolean
    income_details_id: string
  }

  export type QueryParams = {
    bank_account_id?: string
    end_date?: string
    is_paid?: boolean
    start_date?: string
    part?: number
    max_amount?: number
    income_id?: string
    min_amount?: number
    page?: number
  }
}
