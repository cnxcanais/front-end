"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { CreateRamoForm } from "@/modules/ramos-components/create-ramos/presentation/components/CreateRamoForm"

export default function CreateRamosPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cadastrar Ramo" />
      <CreateRamoForm />
    </>
  )
}
