import { ExpenseDetails } from "@/@types/expense-details"
import { ExpenseGroup } from "@/@types/expense-group"
import { Supplier } from "@/@types/suppliers"

export namespace Expense {
  export type GetRequest = {
    is_paid?: string
    document?: string
    start_date?: string
    end_date?: string
    organization_id?: string
    supplier_id?: string
    expense_group_id?: string
  }

  export type ExpenseType = {
    expense_id: string
    description: string
    document: string
    date: string
    expense_percentage: string
    observation: string
    expense_group: ExpenseGroup.Type
    supplier: Supplier.Type
    created_at: Date
    updated_at: Date
    account_id: string
    organization_id: string
    expense_details: ExpenseDetails.ExpenseDetailsType[]
    total_amount: number
    total_parts: number
    formatted_date: string
  }

  export type GetResponse = {
    expenses: ExpenseType[]
  }

  export type GetByIdResponse = {
    expense: ExpenseType
  }

  export type CreateResquest = {
    account_id: string
    date: Date
    description: string
    document: string
    expense_group_id: string
    expense_percentage: number
    supplier_id: string
    organization_id: string
  }

  export type UpdateRequest = {
    expense_id: string
    amount?: number
    date?: string
    description?: string
    document?: string
    expense_group_id?: string
    expense_percentage?: number
    supplier_id?: string
    organization_id?: string
  }
}
