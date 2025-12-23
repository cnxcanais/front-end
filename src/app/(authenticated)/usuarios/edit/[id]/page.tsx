"use client"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { EditUsuarioForm } from "@/modules/usuarios-components/edit-usuario/presentation/components/EditUsuarioForm"
import { use } from "react"

export default function EditUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  const { id } = use(params)
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Editar Usuário</h1>
      <EditUsuarioForm id={id} />
    </div>
  )
}
