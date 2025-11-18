import { PageTitle } from "@/core/components/PageTitle"
import { EditGrupoEconomicoForm } from "@/modules/grupos-economicos-components/edit-grupos-economicos/presentation/components/EditGrupoEconomicoForm"
export default async function EditGrupoEconomicoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <>
      <PageTitle content="Editar Grupo Econômico" />
      <EditGrupoEconomicoForm id={id} />
    </>
  )
}
