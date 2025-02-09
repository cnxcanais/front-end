import { ExpenseGroup } from "@/@types/expense-group"
import { IncomeGroup } from "@/@types/income-group"

export namespace Budget {
  export type Income = {
    budget_income_id: string
    description: string
    date: string
    amount: number
    income_group_id: string
    income_group: IncomeGroup.Type
    created_at: string
    updated_at: string
    account_id: string
  }

  export type Expense = {
    budget_expense_id: string
    description: string
    date: string
    amount: number
    expense_group_id: string
    expense_group: ExpenseGroup.Type
    created_at: string
    updated_at: string
    account_id: string
  }

  export type GetExpenses = {
    budgetExpenses: Expense[]
  }

  export type GetIncomes = {
    budgetIncomes: Income[]
  }

  export type GetIncomeById = {
    budgetIncome: Income | null
  }

  export type GetExpenseById = {
    budgetExpense: Expense | null
  }

  export type CreateIncome = {
    description: string
    date: string
    amount: number
    income_group_id: string
    account_id: string
  }

  export type CreateExpense = {
    description: string
    date: string
    amount: number
    expense_group_id: string
    account_id: string
  }

  export type UpdateIncome = {
    budget_income_id: string
    description?: string
    date?: string
    amount?: number
    income_group_id?: string
    account_id?: string
  }

  export type UpdateExpense = {
    budget_expense_id: string
    description?: string
    date?: string
    amount?: number
    expense_group_id?: string
    account_id?: string
  }

  export type QueryParamsExpense = {
    description?: string
    start_date?: string
    end_date?: string
    expense_group_id?: string
    max_amount?: number
    min_amount?: number
    page: number
  }

  export type QueryParamsIncome = {
    description?: string
    start_date?: string
    end_date?: string
    income_group_id?: string
    max_amount?: number
    min_amount?: number
    page: number
  }
}
