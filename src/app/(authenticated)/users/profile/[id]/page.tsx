import { PageTitle } from "@/core/components/PageTitle"
import { EditUserForm } from "@/modules/user-components/edit-user/presentation/components/EditUserForm"

export default async function UserProfileRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Meu Perfil" />
      <EditUserForm id={id} />
    </>
  )
}
