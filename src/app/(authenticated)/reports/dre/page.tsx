import { PageTitle } from "@/core/components/PageTitle"
import { DRETable } from "@/modules/reports-components/dre-components/presentation/components/DRETable"

export default function DREPage() {
  return (
    <>
      <PageTitle content="DRE" />
      <DRETable />
    </>
  )
}
