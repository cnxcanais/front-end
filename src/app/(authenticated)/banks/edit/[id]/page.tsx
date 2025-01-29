import { EditBankPage } from "@/modules/banks-components/edit-bank/presentation/pages"

export default async function EditBankRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditBankPage id={id} />
}
