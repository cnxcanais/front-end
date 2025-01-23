import { EditIncomeGroupPage } from "@/modules/income-groups-components/edit-income-group/presentation/pages"
export default async function EditIncomeGroupRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditIncomeGroupPage id={id} />
}
