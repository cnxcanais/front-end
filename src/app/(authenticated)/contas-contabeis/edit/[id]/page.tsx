"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { EditContaContabilForm } from "@/modules/contas-contabeis-components/edit-conta-contabil/presentation/components/EditContaContabilForm"
import { use } from "react"

export default function EditContaContabilPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  const { id } = use(params)
  return (
    <>
      <PageTitle content="Editar Conta Contábil" />
      <EditContaContabilForm id={id} />
    </>
  )
}
