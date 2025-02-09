import { PageTitle } from "@/core/components/PageTitle"
import { IncomeGroupTable } from "@/modules/income-components/income-groups-components/dashboard/presentation/components/IncomeGroupsTable"

export default function IncomeGroupRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Grupos de Receitas" />
      <IncomeGroupTable />
    </main>
  )
}
