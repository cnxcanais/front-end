import { PageTitle } from "@/core/components/PageTitle"
import { EditIncomeGroupForm } from "@/modules/income-components/income-groups-components/edit-income-group/presentation/components/EditIncomeGroupForm"

export default async function EditIncomeGroupRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Item de Receita" />
      <EditIncomeGroupForm id={id} />
    </>
  )
}
