import { PageTitle } from "@/core/components/PageTitle"
import { PerfisTable } from "@/modules/perfis-components/perfis/presentation/components/PerfisTable"

export default function PerfisPage() {
  return (
    <>
      <PageTitle content="Perfis" />
      <PerfisTable />
    </>
  )
}
