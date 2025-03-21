import { Expense } from "@/@types/expense"
import { Income } from "@/@types/income"

export function calculateTotals(
  incomes: Income.IncomeByCategoryAndGroup[],
  expenses: Expense.ExpenseByCategoryAndGroup[]
) {
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.total, 0)
  const totalExpense = expenses.reduce(
    (acc, curr) => acc + curr.totalExpenses,
    0
  )
  const totalIncomeTaxes = expenses.reduce(
    (sum, category) =>
      sum +
      category.groups.reduce(
        (groupSum, group) => groupSum + group.incomeTaxes,
        0
      ),
    0
  )
  const totalProfitTaxes = expenses.reduce(
    (sum, category) =>
      sum +
      category.groups.reduce(
        (groupSum, group) => groupSum + group.profitTaxes,
        0
      ),
    0
  )
  const totalOperationalCosts = expenses.reduce(
    (acc, curr) => acc + curr.totalOperationalCosts,
    0
  )
  const profit = totalIncome - totalOperationalCosts - totalIncomeTaxes
  const liquidProfit = profit - totalExpense - totalProfitTaxes

  return {
    totalIncome,
    totalExpense,
    totalIncomeTaxes,
    totalProfitTaxes,
    totalOperationalCosts,
    profit,
    liquidProfit,
  }
}
