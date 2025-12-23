"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { GruposEconomicosTable } from "@/modules/grupos-economicos-components/grupos-economicos/presentation/components/GruposEconomicosTable"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"

export default function GruposEconomicosPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Grupos Econômicos" />
      <GruposEconomicosTable />
    </>
  )
}
