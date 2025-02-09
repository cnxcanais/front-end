import { LoadingScreen } from "@/core/components/LoadingScreen"
import { PageTitle } from "@/core/components/PageTitle"
import { EditIncomeDetailsForm } from "@/modules/income-components/income-details-components/edit-income-details/components/EditIncomeDetailsForm"
import { Suspense } from "react"

export default async function EditIncomeDetailsRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="flex w-full max-w-[1200px] flex-col">
        <PageTitle content="Editar Receitas" />
        <EditIncomeDetailsForm income_details_id={id} />
      </main>
    </Suspense>
  )
}
