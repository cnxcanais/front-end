import { EditUsuarioForm } from "@/modules/usuarios-components/edit-usuario/presentation/components/EditUsuarioForm"

export default function EditUsuarioPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Editar Usuário</h1>
      <EditUsuarioForm id={params.id} />
    </div>
  )
}
