import { PageTitle } from "@/core/components/PageTitle"
import { IncomeSourcesTable } from "@/modules/income-components/income-source-components/income-sources/presentation/components/IncomeSourcesTable"

export default function IncomeSourcesRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Cliente" />
      <IncomeSourcesTable />
    </main>
  )
}
