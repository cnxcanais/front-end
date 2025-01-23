import { PageTitle } from "@/core/components/PageTitle"
import { CreateIncomeSourceForm } from "@/modules/income-source-components/create-income-source/presentation/components/CreateIncomeSourceForm"

export function CreateIncomeSourcePage() {
  return (
    <>
      <PageTitle content="Criar Fonte de Receita" />
      <CreateIncomeSourceForm />
    </>
  )
}
