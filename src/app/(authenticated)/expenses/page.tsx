import { PageTitle } from "@/core/components/PageTitle"
import { ExpenseTable } from "@/modules/expenses-components/expense-components/expense/presentation/components/ExpenseTable"

export default function ExpenseRender() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Despesas" />
      <ExpenseTable />
    </main>
  )
}
