import { PageTitle } from "@/core/components/PageTitle"
import { IncomeGroupTable } from "@/modules/income-components/income-groups-components/dashboard/presentation/components/IncomeGroupsTable"

export function IncomeGroupPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Grupos de Receitas" />
      <IncomeGroupTable />
    </main>
  )
}
