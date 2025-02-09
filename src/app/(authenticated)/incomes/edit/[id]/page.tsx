import { PageTitle } from "@/core/components/PageTitle"
import { EditIncomeForm } from "@/modules/income-components/income-components/edit-income/presentation/components/EditIncomeForm"

export default async function EditIncomeRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Editar Receitas" />
      <EditIncomeForm income_id={id} />
    </main>
  )
}
