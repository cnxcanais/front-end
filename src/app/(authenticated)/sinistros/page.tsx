"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { SinistroKanbam } from "@/modules/sinistros-components/sinistro/presentation/components/SinistroKanbam"

export default function SuppliersRender() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Sinistros" />
      <SinistroKanbam />
    </main>
  )
}
