"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { PerfisTable } from "@/modules/perfis-components/perfis/presentation/components/PerfisTable"

export default function PerfisPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Perfis" />
      <PerfisTable />
    </>
  )
}
