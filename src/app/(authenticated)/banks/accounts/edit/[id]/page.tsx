import { PageTitle } from "@/core/components/PageTitle"
import { EditBankAccountForm } from "@/modules/bank-accounts-components/edit-bank-account/presentation/components/EditBankAccontForm"

export default async function EditBankAccountRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Conta" />
      <EditBankAccountForm id={id} />
    </>
  )
}
