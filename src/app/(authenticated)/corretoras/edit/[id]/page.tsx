import { PageTitle } from "@/core/components/PageTitle"
import { EditCorretoraForm } from "@/modules/corretoras-components/edit-corretora/presentation/components/EditCorretoraForm"

export default async function EditCorretoraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <>
      <PageTitle content="Editar Corretora" />
      <EditCorretoraForm id={id} />
    </>
  )
}
