import { PageTitle } from "@/core/components/PageTitle"
import { CreateBudgetIncomeForm } from "../components/CreateBudgetIncomeForm"

export function CreateBudgetIncomePage() {
  return (
    <main>
      <PageTitle content="Criar Orçamento de Receita" />
      <CreateBudgetIncomeForm />
    </main>
  )
}
