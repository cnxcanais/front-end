import { PageTitle } from "@/core/components/PageTitle"
import { GruposEconomicosTable } from "@/modules/grupos-economicos-components/grupos-economicos/presentation/components/GruposEconomicosTable"

export default function GruposEconomicosPage() {
  return (
    <>
      <PageTitle content="Grupos Econômicos" />
      <GruposEconomicosTable />
    </>
  )
}
