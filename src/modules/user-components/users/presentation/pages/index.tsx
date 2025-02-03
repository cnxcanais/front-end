import { PageTitle } from "@/core/components/PageTitle"
import { UsersTable } from "@/modules/user-components/users/presentation/components/UsersTable"

export function UsersPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Usuários" />
      <UsersTable />
    </main>
  )
}
