import { PageTitle } from "@/core/components/PageTitle"
import { CreateUserForm } from "@/modules/user-components/create-user/presentation/components/CreateUserForm"

export default function CreateUserRender() {
  return (
    <>
      <PageTitle content="Criar Usuário" />
      <CreateUserForm />
    </>
  )
}
