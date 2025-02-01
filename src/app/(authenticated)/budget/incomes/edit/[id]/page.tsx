import { EditAccountPage } from "@/modules/accounts-components/edit-account/presentation/pages"

export default async function EditBudgetIncomeRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditAccountPage id={id} />
}
