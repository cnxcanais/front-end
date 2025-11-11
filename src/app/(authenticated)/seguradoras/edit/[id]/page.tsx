import { PageTitle } from "@/core/components/PageTitle"
import { EditSeguradoraForm } from "@/modules/seguradoras-components/edit-seguradora/presentation/components/EditSupplierForm"

export default async function EditSeguradoraRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Seguradora" />
      <EditSeguradoraForm id={id} />
    </>
  )
}
