import { EditOrganizationPage } from "@/modules/organization-components/edit-organization/presentation/pages"

export default async function EditOrganizationRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditOrganizationPage id={id} />
}
