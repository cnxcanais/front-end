"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { CreateContaContabilForm } from "@/modules/contas-contabeis-components/create-conta-contabil/presentation/components/CreateContaContabilForm"

export default function CreateContaContabilPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cadastrar Conta Contábil" />
      <CreateContaContabilForm />
    </>
  )
}
