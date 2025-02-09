import { PageTitle } from "@/core/components/PageTitle"
import { EditExpenseDetailsForm } from "@/modules/expenses-components/expense-details-components/edit-expense-details/components/EditExpenseDetailsForm"

export default async function EditExpenseDetailsRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Editar Parcela" />
      <EditExpenseDetailsForm expense_details_id={id} />
    </main>
  )
}
