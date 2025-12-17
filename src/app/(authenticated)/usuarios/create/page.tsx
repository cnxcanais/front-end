import { CreateUsuarioForm } from "@/modules/usuarios-components/create-usuario/presentation/components/CreateUsuarioForm"

export default function CreateUsuarioPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Cadastrar Usuário</h1>
      <CreateUsuarioForm />
    </div>
  )
}
