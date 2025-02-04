import { EditUserPage } from "@/modules/user-components/edit-user/presentation/pages"

export default async function EditUserRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditUserPage id={id} />
}
