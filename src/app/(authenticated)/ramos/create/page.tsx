import { PageTitle } from "@/core/components/PageTitle"
import { CreateRamoForm } from "@/modules/ramos-components/create-ramos/presentation/components/CreateRamoForm"

export default function CreateRamosPage() {
  return (
    <>
      <PageTitle content="Cadastrar Ramo" />
      <CreateRamoForm />
    </>
  )
}
