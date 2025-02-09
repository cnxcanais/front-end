import { PageTitle } from "@/core/components/PageTitle"
import { EditAccountForm } from "@/modules/accounts-components/edit-account/presentation/components/EditAccountForm"

export default async function EditAccountRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Conta" />
      <EditAccountForm id={id} />
    </>
  )
}
