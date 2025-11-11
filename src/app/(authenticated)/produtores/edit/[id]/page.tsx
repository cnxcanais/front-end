import { PageTitle } from "@/core/components/PageTitle"
import { EditProdutorForm } from "@/modules/produtores-components/edit-produtor/presentation/components/EditProdutorForm"

export default function EditProdutorPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <>
      <PageTitle content="Editar Produtor" />
      <EditProdutorForm id={params.id} />
    </>
  )
}
