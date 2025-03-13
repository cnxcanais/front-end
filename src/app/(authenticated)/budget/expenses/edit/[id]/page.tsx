import { PageTitle } from "@/core/components/PageTitle"
import { EditBudgetExpenseForm } from "@/modules/budget-components/budget-expense/edit-budget-expense/presentation/components/EditBudgetExpenseForm"

export default async function EditBudgetExpenseRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <main>
      <PageTitle content="Editar Previsão de Receita" />
      <EditBudgetExpenseForm id={id} />
    </main>
  )
}
