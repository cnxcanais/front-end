"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { EditPerfilForm } from "@/modules/perfis-components/edit-perfis/presentation/components/EditPerfilForm"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { use } from "react"

export default function EditPerfilPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Editar Perfil" />
      <EditPerfilForm id={id} />
    </>
  )
}
