import { PageTitle } from "@/core/components/PageTitle"
import { CreateBudgetExpenseForm } from "@/modules/budget-components/budget-expense/create-budget-expense/presentation/components/CreateBudgetExpenseForm"

export default function BudgetExpenseCreateRender() {
  return (
    <main>
      <PageTitle content="Criar Orçamento de Despesa" />
      <CreateBudgetExpenseForm />
    </main>
  )
}
