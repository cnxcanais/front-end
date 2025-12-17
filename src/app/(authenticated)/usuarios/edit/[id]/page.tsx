import { EditUsuarioForm } from "@/modules/usuarios-components/edit-usuario/presentation/components/EditUsuarioForm"

export default async function EditUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Editar Usuário</h1>
      <EditUsuarioForm id={id} />
    </div>
  )
}
