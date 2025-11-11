import { PageTitle } from "@/core/components/PageTitle"
import { CreateProdutorForm } from "@/modules/produtores-components/create-produtor/presentation/components/CreateProdutorForm"

export default function CreateProdutorPage() {
  return (
    <>
      <PageTitle content="Cadastrar Produtor" />
      <CreateProdutorForm />
    </>
  )
}
