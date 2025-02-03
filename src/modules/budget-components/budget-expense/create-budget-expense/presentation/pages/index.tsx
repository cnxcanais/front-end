import { PageTitle } from "@/core/components/PageTitle"
import { CreateBudgetExpenseForm } from "../components/CreateBudgetExpenseForm"

export function CreateBudgetExpensePage() {
  return (
    <main>
      <PageTitle content="Criar Orçamento de Despesa" />
      <CreateBudgetExpenseForm />
    </main>
  )
}
