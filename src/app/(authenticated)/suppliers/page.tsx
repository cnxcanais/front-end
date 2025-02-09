import { PageTitle } from "@/core/components/PageTitle"
import { SuppliersTable } from "@/modules/expenses-components/supplier-components/suppliers/presentation/components/SuppliersTable"

export default function SuppliersRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Fornecedores" />
      <SuppliersTable />
    </main>
  )
}
