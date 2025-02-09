import { PageTitle } from "@/core/components/PageTitle"
import { BankAccountsTable } from "@/modules/bank-accounts-components/bank-accounts/presentation/components/BankAccountsTable"

export default function BankAccountsRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Contas de Bancos" />
      <BankAccountsTable />
    </main>
  )
}
