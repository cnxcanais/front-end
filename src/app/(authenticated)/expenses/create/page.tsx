import { PageTitle } from "@/core/components/PageTitle"
import { CreateExpenseForm } from "@/modules/expenses-components/expense-components/create-expense/presentation/components/CreateExpenseForm"

export default function CreateExpenseRender() {
  return (
    <>
      <PageTitle content="Criar Despesa" />
      <CreateExpenseForm />
    </>
  )
}
