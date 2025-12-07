import { PageTitle } from "@/core/components/PageTitle"
import { ProdutosTable } from "@/modules/produtos-components/produtos/presentation/components/ProdutosTable"

export default function ProdutosPage() {
  return (
    <>
      <PageTitle content="Produtos" />
      <ProdutosTable />
    </>
  )
}
