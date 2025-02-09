export namespace ExpenseDetails {
  export type ExpenseDetailsType = {
    expense_details_id: string
    observation: string
    amount: string
    part: number
    due_date: Date
    is_paid: boolean
    bank_account_id: string
    expense_id: string
    account_id: string
  }

  export type GetRequest = {
    start_date?: string | Date
    end_date?: string | Date
    is_paid?: boolean
    bank_account_id?: string
    page: number
    expense_id?: string
  }

  export type GetResponse = {
    expenseDetails: ExpenseDetailsType[] | []
    totalPages: number
  }

  export type GetbyIdResponse = {
    expenseDetails: ExpenseDetailsType
  }

  export type CreateRequest = {
    amount: number
    bank_account_id: string
    part: number
    due_date: Date
    expense_id: string
    account_id: string
    observation: string
  }

  export type DeleteRequest = {
    expense_details_id: string
  }

  export type UpdateRequest = {
    amount?: number
    bank_account_id?: string
    part?: number
    due_date?: string
    expense_id?: string
    observation?: string
    is_paid?: boolean
    expense_details_id: string
  }

  export type QueryParams = {
    bank_account_id?: string
    end_date?: string
    is_paid?: boolean
    start_date?: string
    part?: number
    max_amount?: number
    expense_id?: string
    min_amount?: number
    page?: number
  }
}
