import { PageTitle } from "@/core/components/PageTitle"
import { CreateSeguradoForm } from "@/modules/segurados-components/create-segurado/presentation/components/CreateSeguradoForm"

export default function CreateSeguradoPage() {
  return (
    <>
      <PageTitle content="Cadastrar Segurado" />
      <CreateSeguradoForm />
    </>
  )
}
