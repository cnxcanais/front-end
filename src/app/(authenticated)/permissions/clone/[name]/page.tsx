import { PageTitle } from "@/core/components/PageTitle"
import { ClonePermissions } from "@/modules/permissions-components/permissions/presentation/components/ClonePermissionsPanel"

export default async function EditPermissionsRender() {
  return (
    <>
      <PageTitle content="Editar Permissões" />
      <ClonePermissions />
    </>
  )
}
