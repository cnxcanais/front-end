import { PageTitle } from "@/core/components/PageTitle"
import { EditProdutorForm } from "@/modules/produtores-components/edit-produtor/presentation/components/EditProdutorForm"

export default async function EditProdutorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <>
      <PageTitle content="Editar Produtor" />
      <EditProdutorForm id={id} />
    </>
  )
}
