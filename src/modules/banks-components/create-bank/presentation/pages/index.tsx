import { PageTitle } from "@/core/components/PageTitle"
import { CreateBankForm } from "@/modules/banks-components/create-bank/presentation/components/CreateBankForm"

export function CreateBankPage() {
  return (
    <>
      <PageTitle content="Criar Banco" />
      <CreateBankForm />
    </>
  )
}
