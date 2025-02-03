import { PageTitle } from "@/core/components/PageTitle"
import { EditBudgetExpenseForm } from "@/modules/budget-components/budget-expense/edit-budget-expense/presentation/components/EditBudgetExpenseForm"

export function EditBudgetExpensePage({ id }: { id: string }) {
  return (
    <main>
      <PageTitle content="Editar Orçamento de Receita" />
      <EditBudgetExpenseForm id={id} />
    </main>
  )
}
