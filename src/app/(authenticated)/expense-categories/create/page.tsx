import { PageTitle } from "@/core/components/PageTitle"
import { CreateExpenseCategoryForm } from "@/modules/expenses-components/expense-categories-components/create-expense-category/presentation/components/CreateExpenseCategoryForm"

export default function ExpenseCategoryCreateRender() {
  return (
    <>
      <PageTitle content="Criar Categoria de Despesa" />
      <CreateExpenseCategoryForm />
    </>
  )
}
