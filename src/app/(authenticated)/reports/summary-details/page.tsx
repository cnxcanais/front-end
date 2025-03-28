import { PageTitle } from "@/core/components/PageTitle"
import { CashflowTable } from "@/modules/reports-components/cash-flow-components/presentation/components/CashflowTable"
import { SummaryDetailsTable } from "@/modules/reports-components/details-summary-components/presentation/components/SummaryDetailsTable"

export default function SummaryDetailsPage() {
  return (
    <>
      <PageTitle content="Resumo de Contas (Realizado)" />
      <SummaryDetailsTable />
    </>
  )
}
