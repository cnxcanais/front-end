import { PageTitle } from "@/core/components/PageTitle"
import { EditExpenseGroupForm } from "@/modules/expenses-components/expense-groups-components/edit-expense-group/presentation/components/EditExpenseGroupForm"

export default async function EditExpenseGroupRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Item de Despesas" />
      <EditExpenseGroupForm id={id} />
    </>
  )
}
