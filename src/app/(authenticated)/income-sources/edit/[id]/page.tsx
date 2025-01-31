import { EditIncomeSourcePage } from "@/modules/income-components/income-source-components/edit-income-source/presentation/pages"

export default async function EditIncomeSourceRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditIncomeSourcePage id={id} />
}
