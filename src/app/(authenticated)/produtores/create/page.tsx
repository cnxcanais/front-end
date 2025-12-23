"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { CreateProdutorForm } from "@/modules/produtores-components/create-produtor/presentation/components/CreateProdutorForm"

export default function CreateProdutorPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cadastrar Produtor" />
      <CreateProdutorForm />
    </>
  )
}
