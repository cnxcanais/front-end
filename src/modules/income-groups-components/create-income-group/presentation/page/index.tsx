import { PageTitle } from "@/core/components/PageTitle"
import { CreateIncomeGroupForm } from "@/modules/income-groups-components/create-income-group/presentation/components/CreateIncomeGroupForm"

export function CreateIncomeGroupPage() {
  return (
    <>
      <PageTitle content="Criar Grupo De Receita" />
      <CreateIncomeGroupForm />
    </>
  )
}
