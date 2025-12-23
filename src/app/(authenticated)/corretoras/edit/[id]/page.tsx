"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { EditCorretoraForm } from "@/modules/corretoras-components/edit-corretora/presentation/components/EditCorretoraForm"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { use } from "react"

export default function EditCorretoraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  const { id } = use(params)

  return (
    <>
      <PageTitle content="Editar Corretora" />
      <EditCorretoraForm id={id} />
    </>
  )
}
