import { PageTitle } from "@/core/components/PageTitle"
import { CreateCorretoraForm } from "@/modules/corretoras-components/create-corretora/presentation/components/CreateCorretoraForm"

export default function CreateCorretoraPage() {
  return (
    <>
      <PageTitle content="Cadastrar Corretora" />
      <CreateCorretoraForm />
    </>
  )
}
