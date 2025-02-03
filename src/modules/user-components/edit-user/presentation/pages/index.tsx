import { PageTitle } from "@/core/components/PageTitle"
import { EditUserForm } from "@/modules/user-components/edit-user/presentation/components/EditUserForm"

export async function EditUserPage({ id }: { id: string }) {
  return (
    <>
      <PageTitle content="Editar Usuário" />
      <EditUserForm id={id} />
    </>
  )
}
