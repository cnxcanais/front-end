"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { EditSeguradoraForm } from "@/modules/seguradoras-components/edit-seguradora/presentation/components/EditSeguradoraForm"
import { use } from "react"

export default function EditSeguradoraRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  const id = use(params).id

  return (
    <>
      <PageTitle content="Editar Seguradora" />
      <EditSeguradoraForm id={id} />
    </>
  )
}
