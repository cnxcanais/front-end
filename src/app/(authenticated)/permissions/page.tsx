import { PageTitle } from "@/core/components/PageTitle"
import { ProfilesTable } from "@/modules/profiles-components/profiles/presentation/components/ProfilesTable"

export default function PermissionsRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Permissões" />
      <ProfilesTable />
    </main>
  )
}
