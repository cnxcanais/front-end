import { PageTitle } from "@/core/components/PageTitle"
import { EditBudgetIncomeForm } from "@/modules/budget-components/budget-income/edit-budget-income/presentation/components/EditBudgetIncomeForm"

export default async function EditBudgetIncomeRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <main>
      <PageTitle content="Editar Previsão de Receita" />
      <EditBudgetIncomeForm id={id} />
    </main>
  )
}
