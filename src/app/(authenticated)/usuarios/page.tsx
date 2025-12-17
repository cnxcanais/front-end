import { UsuariosTable } from "@/modules/usuarios-components/usuario/presentation/components/UsuariosTable"

export default function UsuariosPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Usuários</h1>
      <UsuariosTable />
    </div>
  )
}
