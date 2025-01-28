import { PageTitle } from "@/core/components/PageTitle"
import { BankAccountsTable } from "@/modules/bank-accounts-components/bank-accounts/presentation/components/BankAccountsTable"

export function BankAccountsPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Contas de Bancos" />
      <BankAccountsTable />
    </main>
  )
}
