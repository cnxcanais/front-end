import { PageTitle } from "@/core/components/PageTitle"
import { CreateUserForm } from "@/modules/user-components/create-user/presentation/components/CreateUserForm"

export function CreateUserPage() {
  return (
    <>
      <PageTitle content="Criar Usuário" />
      <CreateUserForm />
    </>
  )
}
