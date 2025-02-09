import { PageTitle } from "@/core/components/PageTitle"
import { CreateIncomeForm } from "@/modules/income-components/income-components/create-income/presentation/components/CreateIncomeForm"

export default function CreateIncomeRender() {
  return (
    <>
      <PageTitle content="Criar Receita" />
      <CreateIncomeForm />
    </>
  )
}
