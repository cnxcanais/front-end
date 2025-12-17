import { ResetarSenhaForm } from "@/modules/usuarios-components/resetar-senha/presentation/components/ResetarSenhaForm"
import { Suspense } from "react"

export default function ResetarSenhaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetarSenhaForm />
    </Suspense>
  )
}
