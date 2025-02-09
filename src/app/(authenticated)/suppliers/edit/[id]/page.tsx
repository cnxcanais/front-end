import { PageTitle } from "@/core/components/PageTitle"
import { EditSupplierForm } from "@/modules/expenses-components/supplier-components/edit-supplier/presentation/components/EditSupplierForm"

export default async function EditSupplierRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return (
    <>
      <PageTitle content="Editar Fornecedor" />
      <EditSupplierForm id={id} />
    </>
  )
}
