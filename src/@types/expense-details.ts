import { Expense } from "./expense"

export namespace ExpenseDetails {
  export type ExpenseDetailsType = {
    expense_details_id: string
    observation: string
    amount: number
    part: number
    due_date: Date
    is_paid: boolean
    bank_account_id: string
    expense_id: string
    account_id: string
    expense: Expense.ExpenseType
  }

  export type GetRequestParams = {
    start_date?: string | Date
    end_date?: string | Date
    is_paid?: boolean
    bank_account_id?: string
    page?: number
    expense_id?: string
  }

  export type GetResponse = {
    expenseDetails: ExpenseDetailsType[] | []
    totalPages: number
  }

  export type GetbyIdResponse = {
    expenseDetails: ExpenseDetailsType
  }

  export type GetByMonthResponse = {
    totalPerMonth: { month: number; value: number }[]
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
    start_date?: string
    end_date?: string
    is_paid?: boolean
    part?: number
    min_amount?: number
    max_amount?: number
    expense_id?: string
    page?: number
  }
}
