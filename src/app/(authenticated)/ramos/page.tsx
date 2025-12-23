"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { RamosTable } from "@/modules/ramos-components/ramos/presentation/components/RamosTable"

export default function CreateCorretoraPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Ramos" />
      <RamosTable />
    </>
  )
}
