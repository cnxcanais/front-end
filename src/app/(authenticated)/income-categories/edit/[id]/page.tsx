import { PageTitle } from "@/core/components/PageTitle"
import { EditIncomeCategoryForm } from "@/modules/income-components/income-categories-components/edit-income-category/presentation/components/EditIncomeCategoryForm"

export default async function EditIncomeCategoryRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Categoria de Receita" />
      <EditIncomeCategoryForm id={id} />
    </>
  )
}
