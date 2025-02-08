import { PageTitle } from "@/core/components/PageTitle"
import { EditExpenseForm } from "../components/EditExpenseForm"

export function EditExpensePage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Editar Despesas" />
      <EditExpenseForm />
    </main>
  )
}
