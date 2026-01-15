"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { TiposSinistrosTable } from "@/modules/tipos-sinistros-components/tipos-sinistros/presentation/components/TiposSinistrosTable"

export default function TiposSinistrosPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Tipos de Sinistros" />
      <TiposSinistrosTable />
    </>
  )
}
