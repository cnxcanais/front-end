import { PageTitle } from "@/core/components/PageTitle"
import { EditBudgetExpenseForm } from "../components/EditBudgetExpenseForm"

export function EditBudgetExpensePage({ id }: { id: string }) {
  return (
    <main>
      <PageTitle content="Editar Orçamento de Receita" />
      <EditBudgetExpenseForm id={id} />
    </main>
  )
}
