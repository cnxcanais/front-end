import { PageTitle } from "@/core/components/PageTitle"
import { EditOrganizationForm } from "@/modules/organization-components/edit-organization/presentation/components/EditOrganizationForm"

export default async function EditOrganizationRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Organização" />
      <EditOrganizationForm id={id} />
    </>
  )
}
