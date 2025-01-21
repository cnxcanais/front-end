import { PageTitle } from "@/core/components/PageTitle"
import { EditOrganizationForm } from "@/modules/organization-components/edit-organization/presentation/components/EditOrganizationForm"

export async function EditOrganizationPage({ id }: { id: string }) {
  return (
    <>
      <PageTitle content="Editar Organização" />
      <EditOrganizationForm id={id} />
    </>
  )
}
