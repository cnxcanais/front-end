import { PageTitle } from "@/core/components/PageTitle"
import { ExpenseDetailsTable } from "@/modules/expenses-components/expense-details-components/expense-details/presentation/components/ExpenseDetailsTable"

export function ExpenseDetailsPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Parcelas" />
      <ExpenseDetailsTable />
    </main>
  )
}
