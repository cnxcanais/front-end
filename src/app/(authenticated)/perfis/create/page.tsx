"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { CreatePerfilForm } from "@/modules/perfis-components/create-perfis/presentation/components/CreateGrupoEconomicoForm"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
export default function CreatePerfilPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cadastrar Perfil" />
      <CreatePerfilForm />
    </>
  )
}
