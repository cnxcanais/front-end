import { PageTitle } from "@/core/components/PageTitle"
import { AccountsTable } from "@/modules/accounts-components/accounts/presentation/components/AccountsTable"

export default function AccountsRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Contas" />
      <AccountsTable />
    </main>
  )
}
