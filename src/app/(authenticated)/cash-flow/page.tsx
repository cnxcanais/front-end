import { PageTitle } from "@/core/components/PageTitle"
import { CashflowTable } from "@/modules/reports-components/cash-flow-components/presentation/components/CashflowTable"

export default function CashFlowPage() {
  return (
    <>
      <PageTitle content="Fluxo de Caixa" />
      <CashflowTable />
    </>
  )
}
