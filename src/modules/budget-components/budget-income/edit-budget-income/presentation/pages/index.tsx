import { PageTitle } from "@/core/components/PageTitle"
import { EditBudgetIncomeForm } from "@/modules/budget-components/budget-income/edit-budget-income/presentation/components/EditBudgetIncomeForm"

export function EditBudgetIncomePage({ id }: { id: string }) {
  return (
    <main>
      <PageTitle content="Editar Orçamento de Receita" />
      <EditBudgetIncomeForm id={id} />
    </main>
  )
}
