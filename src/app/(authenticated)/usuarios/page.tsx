"use client"

import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { UsuariosTable } from "@/modules/usuarios-components/usuario/presentation/components/UsuariosTable"

export default function UsuariosPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Usuários</h1>
      <UsuariosTable />
    </div>
  )
}
