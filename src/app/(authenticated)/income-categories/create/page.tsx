import { PageTitle } from "@/core/components/PageTitle"
import { CreateIncomeCategoryForm } from "@/modules/income-components/income-categories-components/create-income-category/presentation/components/CreateIncomeCategoryForm"

export default function IncomeCategoryCreateRender() {
  return (
    <>
      <PageTitle content="Criar Categoria de Receita" />
      <CreateIncomeCategoryForm />
    </>
  )
}
