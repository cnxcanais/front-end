import { PageTitle } from "@/core/components/PageTitle"
import { EditExpenseForm } from "@/modules/expenses-components/expense-components/edit-expense/presentation/components/EditExpenseForm"

export default async function EditExpenseRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Editar Despesas" />
      <EditExpenseForm expense_id={id} />
    </main>
  )
}
