import { LoadingScreen } from "@/core/components/LoadingScreen"
import { IncomeDetailsPage } from "@/modules/income-components/income-details-components/income-details/presentation/pages"
import { Suspense } from "react"

export default function IncomeDetailsRender() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <IncomeDetailsPage />
    </Suspense>
  )
}
