import { PageTitle } from "@/core/components/PageTitle"
import { CreateSeguradoraForm } from "@/modules/seguradoras-components/create-seguradora/presentation/components/CreateSeguradoraForm"
export default function CreateSeguradoraRender() {
  return (
    <>
      <PageTitle content="Criar Seguradora" />
      <CreateSeguradoraForm />
    </>
  )
}
