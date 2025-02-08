import { LoadingScreen } from "@/core/components/LoadingScreen"
import { EditIncomeDetailsPage } from "@/modules/income-components/income-details-components/edit-income-details/pages/edit-income-details"
import { Suspense } from "react"
export default function IncomeDetailsRender() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <EditIncomeDetailsPage />
    </Suspense>
  )
}
