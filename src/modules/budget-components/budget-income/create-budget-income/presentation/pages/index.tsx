import { PageTitle } from "@/core/components/PageTitle"
import { CreateBudgetIncomeForm } from "@/modules/budget-components/budget-income/create-budget-income/presentation/components/CreateBudgetIncomeForm"

export function CreateBudgetIncomePage() {
  return (
    <main>
      <PageTitle content="Criar Orçamento de Receita" />
      <CreateBudgetIncomeForm />
    </main>
  )
}
