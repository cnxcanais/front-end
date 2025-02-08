import { EditSupplierPage } from "@/modules/expenses-components/supplier-components/edit-supplier/presentation/pages"

export default async function EditSupplierRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <EditSupplierPage id={id} />
}
