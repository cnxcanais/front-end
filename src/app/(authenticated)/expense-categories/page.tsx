import { PageTitle } from "@/core/components/PageTitle"
import { ExpenseCategoriesTable } from "@/modules/expenses-components/expense-categories-components/expense-categories/presentation/components/ExpenseCategoriesTable"

export default function ExpenseCategoryRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Grupos de Despesa" />
      <ExpenseCategoriesTable />
    </main>
  )
}
