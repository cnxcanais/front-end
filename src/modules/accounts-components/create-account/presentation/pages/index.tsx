import { PageTitle } from "@/core/components/PageTitle"
import { CreateAccountForm } from "@/modules/accounts-components/create-account/presentation/components/CreateAccountForm"

export function CreateAccountPage() {
  return (
    <>
      <PageTitle content="Criar Conta" />
      <CreateAccountForm />
    </>
  )
}
