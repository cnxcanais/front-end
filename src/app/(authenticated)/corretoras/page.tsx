import { PageTitle } from "@/core/components/PageTitle"
import { CorretorasTable } from "@/modules/corretoras-components/corretora/presentation/components/CorretorasTable"

export default function CorretorasPage() {
  return (
    <>
      <PageTitle content="Corretoras" />
      <CorretorasTable />
    </>
  )
}
