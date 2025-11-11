import { PageTitle } from "@/core/components/PageTitle"
import { ProdutoresTable } from "@/modules/produtores-components/produtor/presentation/components/ProdutoresTable"

export default function ProdutoresPage() {
  return (
    <>
      <PageTitle content="Produtores" />
      <ProdutoresTable />
    </>
  )
}
