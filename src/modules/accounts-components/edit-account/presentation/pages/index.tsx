import { PageTitle } from "@/core/components/PageTitle"
import { EditAccountForm } from "@/modules/accounts-components/edit-account/presentation/components/EditAccountForm"

export async function EditAccountPage({ id }: { id: string }) {
  return (
    <>
      <PageTitle content="Editar Conta" />
      <EditAccountForm id={id} />
    </>
  )
}
