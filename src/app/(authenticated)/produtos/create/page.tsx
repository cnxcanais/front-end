import { PageTitle } from "@/core/components/PageTitle"
import { CreateProdutoForm } from "@/modules/produtos-components/create-produtos/presentation/components/CreateProdutoForm"

export default function CreateProdutoPage() {
  return (
    <>
      <PageTitle content="Cadastrar Produto" />
      <CreateProdutoForm />
    </>
  )
}
