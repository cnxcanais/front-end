import { EditBudgetExpensePage } from "@/modules/budget-components/budget-expense/edit-budget-expense/presentation/pages"

export default async function EditBudgetExpenseRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditBudgetExpensePage id={id} />
}
