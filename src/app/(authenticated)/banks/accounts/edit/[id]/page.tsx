import { EditBankAccountPage } from "@/modules/bank-accounts-components/edit-bank-account/presentation/pages"

export default async function EditBankAccountRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditBankAccountPage id={id} />
}
