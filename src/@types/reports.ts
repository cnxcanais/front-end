import { Budget } from "./budgets"
import { Expense } from "./expense"
import { Income } from "./income"

export namespace Report {
  export interface CashflowGroup {
    [group_name: string]: number[]
  }

  export type Cashflow = {
    groups: CashflowGroup
    totals: number[]
    grand_total: number
  }

  export type ComparisonData = {
    incomes: Income.IncomeType[]
    expenses: Expense.ExpenseType[]
    budgetIncomes: Budget.Income[]
    budgetExpenses: Budget.Expense[]
  }
}
