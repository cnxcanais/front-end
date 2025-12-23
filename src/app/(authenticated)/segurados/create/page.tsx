"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { CreateSeguradoForm } from "@/modules/segurados-components/create-segurado/presentation/components/CreateSeguradoForm"

export default function CreateSeguradoPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cadastrar Segurado" />
      <CreateSeguradoForm />
    </>
  )
}
