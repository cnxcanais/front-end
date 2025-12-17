import { AtivarUsuarioForm } from "@/modules/usuarios-components/ativar-usuario/presentation/components/AtivarUsuarioForm"
import { Suspense } from "react"

export default function AtivarPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AtivarUsuarioForm />
    </Suspense>
  )
}
