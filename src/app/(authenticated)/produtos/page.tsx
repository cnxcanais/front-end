"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { ProdutosTable } from "@/modules/produtos-components/produtos/presentation/components/ProdutosTable"

export default function ProdutosPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Produtos" />
      <ProdutosTable />
    </>
  )
}
