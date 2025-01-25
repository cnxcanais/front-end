import { PageTitle } from "@/core/components/PageTitle"
import { OrganizationsTable } from "@/modules/organization-components/organizations/presentation/components/OrganizationsTable"

export function OrganizationsPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Organizações" />
      <OrganizationsTable />
    </main>
  )
}
