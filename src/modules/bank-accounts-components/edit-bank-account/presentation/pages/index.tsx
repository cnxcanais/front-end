import { PageTitle } from "@/core/components/PageTitle"
import { EditBankAccountForm } from "@/modules/bank-accounts-components/edit-bank-account/presentation/components/EditBankAccontForm"

export async function EditBankAccountPage({ id }: { id: string }) {
  return (
    <>
      <PageTitle content="Editar Conta" />
      <EditBankAccountForm id={id} />
    </>
  )
}
