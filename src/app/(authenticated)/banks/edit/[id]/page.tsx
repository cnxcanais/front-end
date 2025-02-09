import { PageTitle } from "@/core/components/PageTitle"
import { EditBankForm } from "@/modules/banks-components/edit-bank/presentation/components/EditBankForm"

export default async function EditBankRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Conta" />
      <EditBankForm id={id} />
    </>
  )
}
