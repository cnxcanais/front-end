import { PageTitle } from "@/core/components/PageTitle"
import { CreateIncomeForm } from "../components/CreateIncomeForm"

export function CreateIncomePage() {
  return (
    <>
      <PageTitle content="Criar Receita" />
      <CreateIncomeForm />
    </>
  )
}
