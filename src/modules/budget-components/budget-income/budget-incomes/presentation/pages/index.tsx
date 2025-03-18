import { PageTitle } from "@/core/components/PageTitle"
import { IncomeBudgetTable } from "@/modules/budget-components/budget-income/budget-incomes/presentation/components/BudgetIncomesTable"

export function IncomeBudgetPage() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Previsãos de Receitas" />
      <IncomeBudgetTable />
    </main>
  )
}
