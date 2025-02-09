import { PageTitle } from "@/core/components/PageTitle"
import { CreateBankForm } from "@/modules/banks-components/create-bank/presentation/components/CreateBankForm"

export default function BanksCreateRender() {
  return (
    <>
      <PageTitle content="Criar Banco" />
      <CreateBankForm />
    </>
  )
}
