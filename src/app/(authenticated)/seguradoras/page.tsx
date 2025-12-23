import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { SeguradorasTable } from "@/modules/seguradoras-components/seguradora/presentation/components/SeguradorasTable"

export default function SuppliersRender() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Seguradoras" />
      <SeguradorasTable />
    </main>
  )
}
