import { PageTitle } from "@/core/components/PageTitle"
import { EditIncomeGroupForm } from "../components/EditIncomeGroupForm"

export async function EditIncomeGroupPage({ id }: { id: string }) {
  return (
    <>
      <PageTitle content="Editar Grupo de Receita" />
      <EditIncomeGroupForm id={id} />
    </>
  )
}
