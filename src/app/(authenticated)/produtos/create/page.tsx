"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { CreateProdutoForm } from "@/modules/produtos-components/create-produtos/presentation/components/CreateProdutoForm"

export default function CreateProdutoPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cadastrar Produto" />
      <CreateProdutoForm />
    </>
  )
}
