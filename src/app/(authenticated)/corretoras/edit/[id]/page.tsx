import { PageTitle } from "@/core/components/PageTitle"
import { EditCorretoraForm } from "@/modules/corretoras-components/edit-corretora/presentation/components/EditCorretoraForm"

export default function EditCorretoraPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <>
      <PageTitle content="Editar Corretora" />
      <EditCorretoraForm id={params.id} />
    </>
  )
}
