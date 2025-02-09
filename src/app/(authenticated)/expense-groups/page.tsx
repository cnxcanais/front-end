import { PageTitle } from "@/core/components/PageTitle"
import { ExpenseGroupTable } from "@/modules/expenses-components/expense-groups-components/expense-groups/presentation/components/ExpenseGroupsTable"

export default function ExpenseGroupRender() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Grupos de Despesas" />
      <ExpenseGroupTable />
    </main>
  )
}
