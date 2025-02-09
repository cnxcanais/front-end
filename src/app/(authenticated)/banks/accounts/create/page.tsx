import { PageTitle } from "@/core/components/PageTitle"
import { CreateBankAccountForm } from "@/modules/bank-accounts-components/create-bank-account/presentation/components/CreateBankAccountForm"

export default function BankAccountsCreateRender() {
  return (
    <>
      <PageTitle content="Criar Conta de Banco" />
      <CreateBankAccountForm />
    </>
  )
}
