import { PageTitle } from "@/core/components/PageTitle"
import { IncomeSourcesTable } from "@/modules/income-components/income-source-components/income-sources/presentation/components/IncomeSourcesTable"

export function IncomeSourcesPage() {
  return (
    <main className="flex w-full max-w-[1400px] flex-col">
      <PageTitle content="Franqueados" />
      <IncomeSourcesTable />
    </main>
  )
}
