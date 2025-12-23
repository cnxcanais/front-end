"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { CorretorasTable } from "@/modules/corretoras-components/corretora/presentation/components/CorretorasTable"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"

export default function CorretorasPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)

  return (
    <>
      <PageTitle content="Corretoras" />
      <CorretorasTable />
    </>
  )
}
