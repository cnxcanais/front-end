"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { CreateGrupoEconomicoForm } from "@/modules/grupos-economicos-components/create-grupos-economicos/presentation/components/CreateGrupoEconomicoForm"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"

export default function CreateGrupoEconomicoPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cadastrar Grupo Econômico" />
      <CreateGrupoEconomicoForm />
    </>
  )
}
