import { PageTitle } from "@/core/components/PageTitle"
import { EditPerfilForm } from "@/modules/perfis-components/edit-perfis/presentation/components/EditPerfilForm"

export default async function EditPerfilPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <>
      <PageTitle content="Editar Perfil" />
      <EditPerfilForm id={id} />
    </>
  )
}
