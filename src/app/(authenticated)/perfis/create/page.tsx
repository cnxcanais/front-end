import { PageTitle } from "@/core/components/PageTitle"
import { CreatePerfilForm } from "@/modules/perfis-components/create-perfis/presentation/components/CreateGrupoEconomicoForm"
export default function CreatePerfilPage() {
  return (
    <>
      <PageTitle content="Cadastrar Perfil" />
      <CreatePerfilForm />
    </>
  )
}
