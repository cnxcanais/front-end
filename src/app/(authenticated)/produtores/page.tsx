"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { ProdutoresTable } from "@/modules/produtores-components/produtor/presentation/components/ProdutoresTable"

export default function ProdutoresPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Produtores" />
      <ProdutoresTable />
    </>
  )
}
