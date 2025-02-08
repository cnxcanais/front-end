import { PageTitle } from "@/core/components/PageTitle"
import { SuppliersTable } from "@/modules/expenses-components/supplier-components/suppliers/presentation/components/SuppliersTable"

export function SuppliersPage() {
  return (
    <main className="flex w-full max-w-[1400px] flex-col">
      <PageTitle content="Fornecedores" />
      <SuppliersTable />
    </main>
  )
}
