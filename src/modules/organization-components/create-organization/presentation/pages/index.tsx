import { PageTitle } from "@/core/components/PageTitle"
import { CreateOrganizationForm } from "@/modules/organization-components/create-organization/presentation/components/CreateOrganizationForm"

export function CreateOrganizationPage() {
  return (
    <>
      <PageTitle content="Criar Organização" />
      <CreateOrganizationForm />
    </>
  )
}
