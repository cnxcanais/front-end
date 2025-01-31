import { PageTitle } from "@/core/components/PageTitle"
import { IncomeTable } from "@/modules/income-components/income-components/income/presentation/components/IncomeTable"

export function IncomePage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Receitas" />
      <IncomeTable />
    </main>
  )
}
