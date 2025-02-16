import { PageTitle } from "@/core/components/PageTitle"
import { CreateIncomeGroupForm } from "@/modules/income-components/income-groups-components/create-income-group/presentation/components/CreateIncomeGroupForm"

export default function IncomeGroupCreateRender() {
  return (
    <>
      <PageTitle content="Criar Grupo De Receita" />
      <CreateIncomeGroupForm />
    </>
  )
}
