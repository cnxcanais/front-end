import { PageTitle } from "@/core/components/PageTitle"
import { IncomeBudgetTable } from "@/modules/budget-components/budget-income/budget-incomes/presentation/components/BudgetIncomesTable"

export function BudgetsPage() {
  return (
    <main className="flex w-full max-w-[1000px] flex-col">
      <PageTitle content="Orçamentos" />
      <IncomeBudgetTable />
    </main>
  )
}
