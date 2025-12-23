"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { EditProdutorForm } from "@/modules/produtores-components/edit-produtor/presentation/components/EditProdutorForm"
import { use } from "react"

export default function EditProdutorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Editar Produtor" />
      <EditProdutorForm id={id} />
    </>
  )
}
