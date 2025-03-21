import { PageTitle } from "@/core/components/PageTitle"
import { ExpenseBudgetTable } from "@/modules/budget-components/budget-expense/budget-expenses/presentation/components/BudgetExpensesTable"

export function ExpenseBudgetPage() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Previsãos de Despesas" />
      <ExpenseBudgetTable />
    </main>
  )
}
