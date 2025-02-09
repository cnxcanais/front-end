import { PageTitle } from "@/core/components/PageTitle"
import { CreateExpenseDetailsForm } from "@/modules/expenses-components/expense-details-components/create-expenses-details/components/CreateExpenseDetailsForm"

export default async function CreateExpenseDetailsRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Criar Parcela" />
      <CreateExpenseDetailsForm expense_id={id} />
    </main>
  )
}
