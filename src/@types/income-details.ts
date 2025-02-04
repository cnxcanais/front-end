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
    account_id: string
    start_date?: string | Date
    end_date?: string | Date
    is_paid?: boolean
    bank_account_id?: string
  }

  export type GetResponse = {
    incomeDetails: IncomeDetailsType[] | []
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
}
