import { LoadingScreen } from "@/core/components/LoadingScreen"
import { PageTitle } from "@/core/components/PageTitle"
import { IncomeDetailsTable } from "@/modules/income-components/income-details-components/income-details/presentation/components/incomeDetailsTable"
import { Suspense } from "react"

type SearchParams = { [key: string]: string | undefined }

export default function IncomeDetailsRender({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { income_id } = searchParams

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="flex w-full max-w-[1200px] flex-col">
        <PageTitle content="Parcelas" />
        <IncomeDetailsTable income_id={income_id} />
      </main>
    </Suspense>
  )
}
