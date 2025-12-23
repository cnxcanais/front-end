"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { EditRamoForm } from "@/modules/ramos-components/edit-ramos/presentation/components/EditRamoForm"
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
      <PageTitle content="Editar Ramo" />
      <EditRamoForm id={id} />
    </>
  )
}
