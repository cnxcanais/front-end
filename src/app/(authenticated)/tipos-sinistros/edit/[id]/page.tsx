"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { EditTipoSinistroForm } from "@/modules/tipos-sinistros-components/edit-tipos-sinistros/presentation/components/EditTipoSinistroForm"
import { use } from "react"

export default function EditTipoSinistroPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  const { id } = use(params)

  return (
    <>
      <PageTitle content="Editar Tipo de Sinistro" />
      <EditTipoSinistroForm id={id} />
    </>
  )
}
