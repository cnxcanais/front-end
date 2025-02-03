import { EditBudgetIncomePage } from "@/modules/budget-components/budget-income/edit-budget-income/presentation/pages"

export default async function EditBudgetIncomeRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditBudgetIncomePage id={id} />
}
