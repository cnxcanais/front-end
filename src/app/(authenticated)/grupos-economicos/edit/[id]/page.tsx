"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { EditGrupoEconomicoForm } from "@/modules/grupos-economicos-components/edit-grupos-economicos/presentation/components/EditGrupoEconomicoForm"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { use } from "react"
export default function EditGrupoEconomicoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  const { id } = use(params)

  return (
    <>
      <PageTitle content="Editar Grupo Econômico" />
      <EditGrupoEconomicoForm id={id} />
    </>
  )
}
