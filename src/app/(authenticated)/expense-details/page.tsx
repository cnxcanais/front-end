import { LoadingScreen } from "@/core/components/LoadingScreen"
import { ExpenseDetailsPage } from "@/modules/expenses-components/expense-details-components/expense-details/presentation/pages"
import { Suspense } from "react"

export default function ExpenseDetailsRender() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ExpenseDetailsPage />
    </Suspense>
  )
}
