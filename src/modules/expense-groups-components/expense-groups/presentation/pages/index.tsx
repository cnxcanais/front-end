import { PageTitle } from "@/core/components/PageTitle"
import { ExpenseGroupTable } from "@/modules/expense-groups-components/expense-groups/presentation/components/ExpenseGroupsTable"

export function ExpenseGroupPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Grupos de Despesas" />
      <ExpenseGroupTable />
    </main>
  )
}
