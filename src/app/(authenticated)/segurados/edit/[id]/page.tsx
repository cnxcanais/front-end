import { PageTitle } from "@/core/components/PageTitle"
import { EditSeguradoForm } from "@/modules/segurados-components/edit-segurado/presentation/components/EditSeguradoForm"

export default async function EditSeguradoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <>
      <PageTitle content="Editar Segurado" />
      <EditSeguradoForm id={id} />
    </>
  )
}
