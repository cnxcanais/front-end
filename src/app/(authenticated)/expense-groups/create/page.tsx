import { PageTitle } from "@/core/components/PageTitle"
import { CreateExpenseGroupForm } from "@/modules/expenses-components/expense-groups-components/create-expense-group/presentation/components/CreateExpenseGroupForm"

export default function ExpenseGroupCreateRender() {
  return (
    <>
      <PageTitle content="Criar Item de Despesas" />
      <CreateExpenseGroupForm />
    </>
  )
}
