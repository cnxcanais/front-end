import { PageTitle } from "@/core/components/PageTitle"
import { CreateSupplierForm } from "@/modules/supplier-components/create-supplier/presentation/components/CreateSupplierForm"

export function CreateSupplierPage() {
  return (
    <>
      <PageTitle content="Criar Fornecedor" />
      <CreateSupplierForm />
    </>
  )
}
