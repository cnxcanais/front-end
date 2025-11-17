import { PageTitle } from "@/core/components/PageTitle"
import { EditGrupoEconomicoForm } from "@/modules/grupos-economicos-components/edit-grupos-economicos/presentation/components/EditGrupoEconomicoForm"

export default function EditGrupoEconomicoPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <>
      <PageTitle content="Editar Grupo Econômico" />
      <EditGrupoEconomicoForm id={params.id} />
    </>
  )
}
