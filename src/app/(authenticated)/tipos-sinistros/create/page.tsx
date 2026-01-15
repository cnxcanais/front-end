"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { CreateTipoSinistroForm } from "@/modules/tipos-sinistros-components/create-tipos-sinistros/presentation/components/CreateTipoSinistroForm"

export default function CreateTipoSinistroPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cadastrar Tipo de Sinistro" />
      <CreateTipoSinistroForm />
    </>
  )
}
