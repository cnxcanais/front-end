import { PageTitle } from "@/core/components/PageTitle"
import { ComparisonTable } from "@/modules/reports-components/comparison-components/presentation/components/ComparisonTable"

export default function ComparisonPage() {
  return (
    <>
      <PageTitle content="Comparativo" />
      <ComparisonTable />
    </>
  )
}
