import { PageTitle } from "@/core/components/PageTitle"
import { EditSupplierForm } from "@/modules/expenses-components/supplier-components/edit-supplier/presentation/components/EditSupplierForm"

export async function EditSupplierPage({ id }: { id: string }) {
  return (
    <>
      <PageTitle content="Editar Fornecedor" />
      <EditSupplierForm id={id} />
    </>
  )
}
