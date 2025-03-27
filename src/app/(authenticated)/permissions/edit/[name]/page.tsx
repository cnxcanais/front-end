import { PageTitle } from "@/core/components/PageTitle"
import { EditPermissions } from "@/modules/permissions-components/permissions/presentation/components/EditPermissionsPanel"

export default async function EditPermissionsRender() {
  return (
    <>
      <PageTitle content="Editar Permissões" />
      <EditPermissions />
    </>
  )
}
