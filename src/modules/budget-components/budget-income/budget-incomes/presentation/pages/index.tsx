import { PageTitle } from "@/core/components/PageTitle"
import { IncomeBudgetTable } from "@/modules/budget-components/budget-income/budget-incomes/presentation/components/BudgetIncomesTable"

export function IncomeBudgetPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Orçamentos de Receitas" />
      <IncomeBudgetTable />
    </main>
  )
}
