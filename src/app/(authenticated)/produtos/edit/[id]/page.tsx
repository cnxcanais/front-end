"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { EditProdutoForm } from "@/modules/produtos-components/edit-produtos/presentation/components/EditProdutoForm"
import { use } from "react"

export default function EditProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  const { id } = use(params)

  return (
    <>
      <PageTitle content="Editar Produto" />
      <EditProdutoForm id={id} />
    </>
  )
}
