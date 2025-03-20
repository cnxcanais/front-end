import { PageTitle } from "@/core/components/PageTitle"
import { PathPermissionsTable } from "@/modules/permissions-components/permissions/presentation/components/PathPermissionsTable"

export default async function EditPermissionsRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Permissões" />
      <PathPermissionsTable id={id} />
    </>
  )
}
