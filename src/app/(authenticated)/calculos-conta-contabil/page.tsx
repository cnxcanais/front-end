"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { CalculosContaContabilTable } from "@/modules/calculos-conta-contabil-components/calculos-conta-contabil/presentation/components/CalculosContaContabilTable"

export default function CalculosContaContabilPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cálculos por Conta Contábil" />
      <CalculosContaContabilTable />
    </>
  )
}
