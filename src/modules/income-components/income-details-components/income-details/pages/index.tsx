import { PageTitle } from "@/core/components/PageTitle"
import { IncomeDetailsTable } from "@/modules/income-components/income-details-components/income-details/components/incomeDetailsTable"

export function IncomeDetailsPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Receitas" />
      <IncomeDetailsTable />
    </main>
  )
}
