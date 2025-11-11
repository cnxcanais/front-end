import { PageTitle } from "@/core/components/PageTitle"
import { SeguradorasTable } from "@/modules/seguradoras-components/seguradora/presentation/components/SeguradorasTable"

export default function SuppliersRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Seguradoras" />
      <SeguradorasTable />
    </main>
  )
}
