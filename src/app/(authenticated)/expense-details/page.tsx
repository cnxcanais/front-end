import { LoadingScreen } from "@/core/components/LoadingScreen"
import { PageTitle } from "@/core/components/PageTitle"
import { ExpenseDetailsTable } from "@/modules/expenses-components/expense-details-components/expense-details/presentation/components/ExpenseDetailsTable"
import { Suspense } from "react"

type SearchParams = { expense_id: string | undefined }

export default async function ExpenseDetailsRender({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { expense_id } = await searchParams

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="flex w-full flex-col">
        <PageTitle content="Parcelas" />
        <ExpenseDetailsTable expense_id={expense_id} />
      </main>
    </Suspense>
  )
}
