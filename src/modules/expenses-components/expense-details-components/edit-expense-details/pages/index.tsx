import { PageTitle } from "@/core/components/PageTitle"
import { EditIncomeDetailsForm } from "@/modules/income-components/income-details-components/edit-income-details/components/EditIncomeDetailsForm"

export function EditIncomeDetailsPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Editar Receitas" />
      <EditIncomeDetailsForm />
    </main>
  )
}
