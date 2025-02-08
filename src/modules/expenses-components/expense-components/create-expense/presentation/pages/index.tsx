import { PageTitle } from "@/core/components/PageTitle"
import { CreateExpenseForm } from "../components/CreateExpenseForm"

export function CreateExpensePage() {
  return (
    <>
      <PageTitle content="Criar Despesa" />
      <CreateExpenseForm />
    </>
  )
}
