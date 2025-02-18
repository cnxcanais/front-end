import { PageTitle } from "@/core/components/PageTitle"
import { ExpenseGroupTable } from "@/modules/expenses-components/expense-groups-components/expense-groups/presentation/components/ExpenseGroupsTable"

export default function ExpenseGroupRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Itens de Despesas" />
      <ExpenseGroupTable />
    </main>
  )
}
