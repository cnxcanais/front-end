"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { ContasContabeisTable } from "@/modules/contas-contabeis-components/contas-contabeis/presentation/components/ContasContabeisTable"

export default function ContasContabeisPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Contas Contábeis" />
      <ContasContabeisTable />
    </>
  )
}
