"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { CreateSeguradoraForm } from "@/modules/seguradoras-components/create-seguradora/presentation/components/CreateSeguradoraForm"

export default function CreateSeguradoraRender() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Criar Seguradora" />
      <CreateSeguradoraForm />
    </>
  )
}
