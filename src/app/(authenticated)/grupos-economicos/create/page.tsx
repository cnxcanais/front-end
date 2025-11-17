import { PageTitle } from "@/core/components/PageTitle"
import { CreateGrupoEconomicoForm } from "@/modules/grupos-economicos-components/create-grupos-economicos/presentation/components/CreateGrupoEconomicoForm"

export default function CreateGrupoEconomicoPage() {
  return (
    <>
      <PageTitle content="Cadastrar Grupo Econômico" />
      <CreateGrupoEconomicoForm />
    </>
  )
}
