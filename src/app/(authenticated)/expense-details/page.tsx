import { LoadingScreen } from "@/core/components/LoadingScreen"
import { PageTitle } from "@/core/components/PageTitle"
import { ExpenseDetailsTable } from "@/modules/expenses-components/expense-details-components/expense-details/presentation/components/ExpenseDetailsTable"
import { Suspense } from "react"

export default function ExpenseDetailsRender() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="flex w-full max-w-[1200px] flex-col">
        <PageTitle content="Parcelas" />
        <ExpenseDetailsTable />
      </main>
    </Suspense>
  )
}
