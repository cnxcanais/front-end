import { PageTitle } from "@/core/components/PageTitle"
import { MeuUsuarioPage } from "@/modules/meu-usuario/presentation/MeuUsuarioPage"

export default function Page() {
  return (
    <>
      <PageTitle content="Meu Usuário" />
      <MeuUsuarioPage />
    </>
  )
}
