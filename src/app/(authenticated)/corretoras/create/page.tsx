"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { CreateCorretoraForm } from "@/modules/corretoras-components/create-corretora/presentation/components/CreateCorretoraForm"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"

export default function CreateCorretoraPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cadastrar Corretora" />
      <CreateCorretoraForm />
    </>
  )
}
