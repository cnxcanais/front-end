import { PageTitle } from "@/core/components/PageTitle"
import { CreateBudgetIncomeForm } from "@/modules/budget-components/budget-income/create-budget-income/presentation/components/CreateBudgetIncomeForm"

export default function BudgetIncomeCreateRender() {
  return (
    <main>
      <PageTitle content="Criar Orçamento de Receita" />
      <CreateBudgetIncomeForm />
    </main>
  )
}
