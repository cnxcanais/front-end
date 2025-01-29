import { PageTitle } from "@/core/components/PageTitle"
import { EditBankForm } from "@/modules/banks-components/edit-bank/presentation/components/EditBankForm"

export async function EditBankPage({ id }: { id: string }) {
  return (
    <>
      <PageTitle content="Editar Conta" />
      <EditBankForm id={id} />
    </>
  )
}
