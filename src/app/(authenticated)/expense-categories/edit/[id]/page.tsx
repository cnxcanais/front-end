import { PageTitle } from "@/core/components/PageTitle"
import { EditExpenseCategoryForm } from "@/modules/expenses-components/expense-categories-components/edit-expense-category/presentation/components/EditExpenseCategoryForm"

export default async function EditExpenseCategoryRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Categoria de Despesa" />
      <EditExpenseCategoryForm id={id} />
    </>
  )
}
