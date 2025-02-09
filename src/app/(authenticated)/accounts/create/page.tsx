import { PageTitle } from "@/core/components/PageTitle"
import { CreateAccountForm } from "@/modules/accounts-components/create-account/presentation/components/CreateAccountForm"

export default function AccountsCreateRender() {
  return (
    <>
      <PageTitle content="Criar Conta" />
      <CreateAccountForm />
    </>
  )
}
