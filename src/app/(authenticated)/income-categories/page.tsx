import { PageTitle } from "@/core/components/PageTitle"
import { IncomeCategoriesTable } from "@/modules/income-components/income-categories-components/income-categories/presentation/components/IncomeCategoriesTable"

export default function IncomeCategoryRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Grupos de Receita" />
      <IncomeCategoriesTable />
    </main>
  )
}
