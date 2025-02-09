import { PageTitle } from "@/core/components/PageTitle"
import { EditIncomeSourceForm } from "@/modules/income-components/income-source-components/edit-income-source/presentation/components/EditIncomeSourceForm"

export default async function EditIncomeSourceRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Fonte de Receita" />
      <EditIncomeSourceForm income_source_id={id} />
    </>
  )
}
