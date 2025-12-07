import { PageTitle } from "@/core/components/PageTitle"
import { EditRamoForm } from "@/modules/ramos-components/edit-ramos/presentation/components/EditRamoForm"
export default async function EditGrupoEconomicoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <>
      <PageTitle content="Editar Ramo" />
      <EditRamoForm id={id} />
    </>
  )
}
