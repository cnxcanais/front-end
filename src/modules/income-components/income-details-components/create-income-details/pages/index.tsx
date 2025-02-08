import { PageTitle } from "@/core/components/PageTitle"
import { CreateIncomeDetailsForm } from "@/modules/income-components/income-details-components/create-income-details/components/CreateIncomeDetailsForm"

export function EditIncomeDetailsPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Criar Parcela" />
      <CreateIncomeDetailsForm />
    </main>
  )
}
