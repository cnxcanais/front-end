import { PageTitle } from "@/core/components/PageTitle"
import { EditIncomeForm } from "../components/EditIncomeForm"
export function EditIncomePage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Editar Receitas" />
      <EditIncomeForm />
    </main>
  )
}
