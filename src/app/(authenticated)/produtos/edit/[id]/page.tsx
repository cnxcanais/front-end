import { PageTitle } from "@/core/components/PageTitle"
import { EditProdutoForm } from "@/modules/produtos-components/edit-produtos/presentation/components/EditProdutoForm"

export default async function EditProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <>
      <PageTitle content="Editar Produto" />
      <EditProdutoForm id={id} />
    </>
  )
}
