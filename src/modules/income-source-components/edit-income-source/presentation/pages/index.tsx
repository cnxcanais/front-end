import { PageTitle } from "@/core/components/PageTitle"
import { EditIncomeSourceForm } from "@/modules/income-source-components/edit-income-source/presentation/components/EditIncomeSourceForm"

export async function EditIncomeSourcePage({ id }: { id: string }) {
  return (
    <>
      <PageTitle content="Editar Organização" />
      <EditIncomeSourceForm id={id} />
    </>
  )
}
