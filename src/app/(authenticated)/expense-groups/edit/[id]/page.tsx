import { EditExpenseGroupPage } from "@/modules/expense-groups-components/edit-expense-group/presentation/pages"
export default async function EditExpenseGroupRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditExpenseGroupPage id={id} />
}
