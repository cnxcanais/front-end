"use client"

import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { CreateUsuarioForm } from "@/modules/usuarios-components/create-usuario/presentation/components/CreateUsuarioForm"

export default function CreateUsuarioPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Cadastrar Usuário</h1>
      <CreateUsuarioForm />
    </div>
  )
}
