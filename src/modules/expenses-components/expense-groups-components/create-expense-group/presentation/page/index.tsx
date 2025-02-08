import { PageTitle } from "@/core/components/PageTitle"
import { CreateExpenseGroupForm } from "@/modules/expenses-components/expense-groups-components/create-expense-group/presentation/components/CreateExpenseGroupForm"

export function CreateExpenseGroupPage() {
  return (
    <>
      <PageTitle content="Criar Grupo De Despesas" />
      <CreateExpenseGroupForm />
    </>
  )
}
