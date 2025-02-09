import { LoadingScreen } from "@/core/components/LoadingScreen"
import { PageTitle } from "@/core/components/PageTitle"
import { IncomeDetailsTable } from "@/modules/income-components/income-details-components/income-details/presentation/components/incomeDetailsTable"
import { Suspense } from "react"

type SearchParams = { income_id: string | undefined }

export default async function IncomeDetailsRender({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { income_id } = await searchParams

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="flex w-full flex-col">
        <PageTitle content="Parcelas" />
        <IncomeDetailsTable income_id={income_id} />
      </main>
    </Suspense>
  )
}
