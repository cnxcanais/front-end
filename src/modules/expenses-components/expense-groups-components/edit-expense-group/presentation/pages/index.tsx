import { PageTitle } from "@/core/components/PageTitle"
import { EditExpenseGroupForm } from "@/modules/expenses-components/expense-groups-components/edit-expense-group/presentation/components/EditExpenseGroupForm"

export async function EditExpenseGroupPage({ id }: { id: string }) {
  return (
    <>
      <PageTitle content="Editar Grupo de Despesas" />
      <EditExpenseGroupForm id={id} />
    </>
  )
}
